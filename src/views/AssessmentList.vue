<template>
  <div>
    <div class="page-header">
        <h1>Quản lý phiếu đánh giá</h1>
    </div>

    <div class="card">
        <!-- Toolbar: filter form + download button -->
        <div class="card-toolbar">
            <form @submit.prevent="handleFilter" class="filter-section">
                <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                    <div class="form-group" style="width: 250px;">
                        <label>Tên bệnh nhân</label>
                        <input type="text" v-model="filters.name" placeholder="Nhập tên...">
                    </div>
                    <div class="form-group">
                        <label>Tuổi trên</label>
                        <input type="number" v-model="filters.age" placeholder="Ví dụ: 60">
                    </div>
                    <div class="form-group">
                        <label>Giới tính</label>
                        <select v-model="filters.gender" class="custom-select" style="width: 120px;">
                            <option value="">Tất cả</option>
                            <option value="1">Nam</option>
                            <option value="2">Nữ</option>
                        </select>
                    </div>
                </div>
                <div style="display: flex; gap: 8px; margin: 20px 0;">
                    <button type="submit" class="btn-filter">TÌM KIẾM</button>
                    <button type="button" @click="resetFilters" class="btn-reset">LÀM MỚI</button>
                </div>
            </form>

            <button class="btn-download" @click="openDownloadModal">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Tải danh sách bệnh nhân
            </button>
        </div>

        <hr style="border: 0; border-top: 1px solid var(--border); margin: 0 0 20px 0;">

        <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Bệnh nhân</th>
                    <th>Tuổi</th>
                    <th>Giới tính</th>
                    <th>CCI</th>
                    <th>Mini-Cog</th>
                    <th>MNA</th>
                    <th>CFS</th>
                    <th>Morse</th>
                    <th>Ngày đánh giá</th>
                    <th class="sticky-column"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in assessments" :key="item.uuid">
                    <td>{{ (pagination.page - 1) * pagination.limit + index + 1 }}</td>
                    <td><strong>{{ item.patientName }}</strong></td>
                    <td>{{ item.birthYear ? (new Date().getFullYear() - item.birthYear) : '--' }}</td>
                    <td>{{ item.gender === 1 ? 'Nam' : 'Nữ' }}</td>
                    <td>
                        <span class="badge" :class="item.cciTotalScore > 0 ? 'badge-risk' : 'badge-normal'">
                            {{ item.cciTotalScore }}đ
                        </span>
                    </td>
                    <td>
                        <template v-if="item.minicogTotalScore !== null && item.minicogTotalScore !== undefined">
                            <span class="badge" :class="item.minicogTotalScore < 3 ? 'badge-risk' : 'badge-normal'">
                                {{ item.minicogTotalScore }}đ
                            </span>
                        </template>
                        <template v-else>
                            <span style="color: #94a3b8; font-style: italic;">—</span>
                        </template>
                    </td>
                    <td>
                        <span class="badge" :class="item.mnaTotalScore < 12 ? 'badge-risk' : 'badge-normal'">
                            {{ item.mnaTotalScore }}đ
                        </span>
                    </td>
                    <td>
                        <span class="badge" :class="item.cfsTotalScore > 4 ? 'badge-risk' : 'badge-normal'">
                            {{ item.cfsTotalScore }}đ
                        </span>
                    </td>
                    <td>
                        <span class="badge" :class="item.morseTotalScore >= 25 ? 'badge-risk' : 'badge-normal'">
                            {{ item.morseTotalScore }}đ
                        </span>
                    </td>
                    <td>{{ new Date(item.createdAt).toLocaleDateString('vi-VN') }}</td>
                    <td class="sticky-column">
                        <router-link :to="'/assessments/' + item.uuid" target="_blank" style="color: var(--primary); font-weight: 600; text-decoration: none;">Xem chi tiết</router-link>
                    </td>
                </tr>
                <tr v-if="assessments.length === 0">
                    <td colspan="11" style="text-align: center; color: #64748b; padding: 40px;">Không tìm thấy phiếu nào.</td>
                </tr>
            </tbody>
        </table>
        </div>

        <div v-if="pagination.totalPages > 1" class="pagination">
            <button v-if="pagination.page > 1" @click="changePage(pagination.page - 1)" class="btn-pagination">Trước</button>
            
            <div class="page-numbers">
                <button v-for="p in pagination.totalPages" :key="p" @click="changePage(p)" class="page-number" :class="{ active: p === pagination.page }">
                    {{ p }}
                </button>
            </div>

            <button v-if="pagination.page < pagination.totalPages" @click="changePage(pagination.page + 1)" class="btn-pagination">Sau</button>
        </div>
    </div>

    <!-- Download Modal -->
    <Teleport to="body">
        <div v-if="showDownloadModal" class="modal-overlay" @click.self="closeDownloadModal">
            <div class="modal-box">
                <div class="modal-header">
                    <h2>Tải xuống tệp đánh giá</h2>
                    <button class="modal-close" @click="closeDownloadModal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                <div class="modal-body">
                    <!-- Range options -->
                    <div class="range-options">
                        <label class="radio-option" :class="{ active: downloadRange === 'all' }">
                            <input type="radio" v-model="downloadRange" value="all">
                            <span class="radio-circle"></span>
                            <div class="radio-content">
                                <span class="radio-label">Tất cả</span>
                                <span class="radio-desc">Tải toàn bộ dữ liệu đánh giá</span>
                            </div>
                        </label>
                        <label class="radio-option" :class="{ active: downloadRange === 'custom' }">
                            <input type="radio" v-model="downloadRange" value="custom">
                            <span class="radio-circle"></span>
                            <div class="radio-content">
                                <span class="radio-label">Tùy chọn</span>
                                <span class="radio-desc">Chọn khoảng ngày cụ thể</span>
                            </div>
                        </label>
                    </div>

                    <!-- Date pickers -->
                    <div class="date-range" :class="{ disabled: downloadRange === 'all' }">
                        <div class="date-group">
                            <label>Ngày bắt đầu</label>
                            <input
                                type="date"
                                v-model="downloadDateFrom"
                                :disabled="downloadRange === 'all'"
                                :max="downloadDateTo || undefined"
                            >
                        </div>
                        <div class="date-sep">—</div>
                        <div class="date-group">
                            <label>Ngày kết thúc</label>
                            <input
                                type="date"
                                v-model="downloadDateTo"
                                :disabled="downloadRange === 'all'"
                                :min="downloadDateFrom || undefined"
                            >
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn-cancel" @click="closeDownloadModal">Hủy</button>
                    <button class="btn-confirm-download" @click="handleDownload" :disabled="downloadLoading">
                        <svg v-if="!downloadLoading" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        <span v-if="downloadLoading" class="spinner"></span>
                        {{ downloadLoading ? 'Đang tải...' : 'Tải về' }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import * as XLSX from 'xlsx';
import api from '../api';

const assessments = ref<any[]>([]);
const loading = ref(true);
const filters = reactive({
  name: '',
  gender: '',
  age: '',
});

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
});

// ─── Download modal state ────────────────────────────────────────────────────
const showDownloadModal = ref(false);
const downloadRange = ref<'all' | 'custom'>('all');
const downloadDateFrom = ref('');
const downloadDateTo = ref('');
const downloadLoading = ref(false);

const openDownloadModal = () => {
    downloadRange.value = 'all';
    downloadDateFrom.value = '';
    downloadDateTo.value = '';
    showDownloadModal.value = true;
};

const closeDownloadModal = () => {
    showDownloadModal.value = false;
};

const handleDownload = async () => {
    downloadLoading.value = true;
    try {
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('limit', '100000'); // fetch all records

        if (downloadRange.value === 'custom') {
            if (downloadDateFrom.value) params.append('dateFrom', downloadDateFrom.value);
            if (downloadDateTo.value)   params.append('dateTo',   downloadDateTo.value);
        }

        const response = await api.get(`/assessments/management?${params.toString()}`);
        const data: any[] = response.data.assessments || [];

        const rows = data.map((item: any, index: number) => ({
            'STT': index + 1,
            'Bệnh nhân': item.patientName || '',
            'Tuổi': item.birthYear ? (new Date().getFullYear() - item.birthYear) : '',
            'Giới tính': item.gender === 1 ? 'Nam' : 'Nữ',
            'CCI': item.cciTotalScore ?? '',
            'Mini-Cog': item.minicogTotalScore ?? '',
            'MNA': item.mnaTotalScore ?? '',
            'CFS': item.cfsTotalScore ?? '',
            'Morse': item.morseTotalScore ?? '',
            'Ngày đánh giá': item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '',
        }));

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook  = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Đánh giá');

        worksheet['!cols'] = [
            { wch: 6 }, { wch: 28 }, { wch: 8 }, { wch: 10 },
            { wch: 8 }, { wch: 10 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 16 },
        ];

        const filename = downloadRange.value === 'custom' && (downloadDateFrom.value || downloadDateTo.value)
            ? `danh-gia_${downloadDateFrom.value || 'all'}_den_${downloadDateTo.value || 'all'}.xlsx`
            : 'danh-gia_tat-ca.xlsx';

        XLSX.writeFile(workbook, filename);
        closeDownloadModal();
    } catch (err) {
        console.error('Download failed:', err);
        alert('Có lỗi xảy ra khi tải tệp. Vui lòng thử lại.');
    } finally {
        downloadLoading.value = false;
    }
};

// ─── Filter & pagination ─────────────────────────────────────────────────────
const handleFilter = () => {
    pagination.page = 1;
    fetchAssessments();
};

const resetFilters = () => {
    filters.name = '';
    filters.gender = '';
    filters.age = '';
    handleFilter();
};

const changePage = (p: number) => {
    pagination.page = p;
    fetchAssessments();
};

const fetchAssessments = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    if (filters.name)   params.append('name',   filters.name);
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.age)    params.append('age',    filters.age);
    params.append('page',  pagination.page.toString());
    params.append('limit', pagination.limit.toString());
    
    const response = await api.get(`/assessments/management?${params.toString()}`);
    assessments.value     = response.data.assessments;
    pagination.total      = response.data.total;
    pagination.totalPages = response.data.totalPages;
  } catch (error) {
    console.error('Failed to fetch assessments:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchAssessments);
</script>

<style scoped>
/* ── Card toolbar ──────────────────────────────────────────────── */
.card-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    flex-wrap: wrap;
}

.filter-section {
    flex: 1;
    min-width: 0;
}

.btn-download {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
    flex-shrink: 0;
    align-self: flex-start;
}

.btn-download:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.45);
}

.btn-download:active {
    transform: translateY(0);
}

/* ── Pagination ────────────────────────────────────────────────── */
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 30px;
    padding: 20px 0;
}

.page-numbers {
    display: flex;
    gap: 6px;
}

.btn-pagination, .page-number {
    padding: 8px 16px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: white;
    color: #475569;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
    cursor: pointer;
}

.page-number.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}

/* ── Filter buttons ────────────────────────────────────────────── */
.btn-filter {
    background: var(--primary);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
}

.btn-reset {
    background: #f1f5f9;
    color: #475569;
    border: 1px solid var(--border);
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
}

/* ── Table ─────────────────────────────────────────────────────── */
.table-container {
    width: 100%;
    overflow-x: auto;
    position: relative;
    border: 1px solid var(--border);
    border-radius: 8px;
}

table {
    border: none;
    min-width: 1000px;
}

.sticky-column {
    position: sticky;
    right: 0;
    background: white;
    z-index: 10;
    box-shadow: -2px 0 5px rgba(0,0,0,0.05);
}

th.sticky-column {
    background: #f1f5f9;
}

tr:hover .sticky-column {
    background: #f8fafc;
}

/* ── Modal overlay ─────────────────────────────────────────────── */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.18s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
}

.modal-box {
    background: #ffffff;
    border-radius: 16px;
    width: 600px;
    max-width: calc(100vw - 32px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    animation: slideUp 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
    overflow: hidden;
}

@keyframes slideUp {
    from { transform: translateY(24px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px 16px;
    border-bottom: 1px solid #f1f5f9;
}

.modal-header h2 {
    font-size: 17px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
}

.modal-close {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    transition: color 0.15s, background 0.15s;
}

.modal-close:hover {
    color: #334155;
    background: #f1f5f9;
}

.modal-body {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Radio options */
.range-options {
    display: flex;
    gap: 12px;
}

.radio-option {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.18s ease;
}

.radio-option input[type="radio"] {
    display: none;
}

.radio-option.active {
    border-color: var(--primary, #4f46e5);
    background: rgba(79, 70, 229, 0.04);
}

.radio-circle {
    width: 18px;
    height: 18px;
    border: 2px solid #cbd5e1;
    border-radius: 50%;
    flex-shrink: 0;
    position: relative;
    transition: all 0.18s;
}

.radio-option.active .radio-circle {
    border-color: var(--primary, #4f46e5);
    background: var(--primary, #4f46e5);
}

.radio-option.active .radio-circle::after {
    content: '';
    position: absolute;
    inset: 3px;
    background: white;
    border-radius: 50%;
}

.radio-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.radio-label {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
}

.radio-desc {
    font-size: 12px;
    color: #94a3b8;
}

/* Date range */
.date-range {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    transition: opacity 0.2s;
}

.date-range.disabled {
    opacity: 0.4;
    pointer-events: none;
}

.date-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.date-group label {
    font-size: 13px;
    font-weight: 600;
    color: #475569;
}

.date-group input[type="date"] {
    padding: 9px 12px;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    color: #1e293b;
    background: white;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.15s;
    cursor: pointer;
}

.date-group input[type="date"]:focus {
    outline: none;
    border-color: var(--primary, #4f46e5);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.date-sep {
    color: #94a3b8;
    font-size: 18px;
    padding-bottom: 10px;
    flex-shrink: 0;
}

/* Modal footer */
.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 24px 20px;
    border-top: 1px solid #f1f5f9;
}

.btn-cancel {
    padding: 10px 20px;
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
}

.btn-cancel:hover {
    background: #e2e8f0;
}

.btn-confirm-download {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.btn-confirm-download:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.45);
}

.btn-confirm-download:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

/* Spinner */
.spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>
