<template>
  <div>
    <div class="page-header">
        <h1>Quản lý phiếu đánh giá</h1>
    </div>

    <div class="card">
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
            <hr style="border: 0; border-top: 1px solid var(--border); margin: 20px 0;">
        </form>

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
                        <span class="badge" :class="item.minicogTotalScore < 3 ? 'badge-risk' : 'badge-normal'">
                            {{ item.minicogTotalScore }}đ
                        </span>
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
                    <td colspan="10" style="text-align: center; color: #64748b; padding: 40px;">Không tìm thấy phiếu nào.</td>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
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
    if (filters.name) params.append('name', filters.name);
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.age) params.append('age', filters.age);
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());
    
    const response = await api.get(`/assessments/management?${params.toString()}`);
    assessments.value = response.data.assessments;
    pagination.total = response.data.total;
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

.table-container {
    width: 100%;
    overflow-x: auto;
    position: relative;
    border: 1px solid var(--border);
    border-radius: 8px;
}

table {
    border: none; /* Removed outer border because container has it */
    min-width: 1000px; /* Force scroll on smaller containers */
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
    background: #f8fafc; /* Match hover color */
}
</style>
