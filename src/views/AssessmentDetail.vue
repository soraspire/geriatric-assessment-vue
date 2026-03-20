<template>
  <div class="card">
    <h1>Kết Quả Đánh Giá Lão Khoa Toàn Diện</h1>
    <div v-if="assessment" class="patient-info" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 15px; margin-bottom: 20px;">
        <p><strong>Bệnh nhân:</strong> {{ assessment.patientName }}</p>
        <p><strong>Năm sinh:</strong> {{ assessment.birthYear }}</p>
        <p><strong>Giới tính:</strong> {{ assessment.gender === 1 ? 'Nam' : 'Nữ' }}</p>
        <p><strong>Điện thoại:</strong> {{ assessment.phoneNumber || 'N/A' }}</p>
        <p><strong>Nghề nghiệp:</strong> {{ assessment.previousJob || 'N/A' }}</p>
        <p><strong>BMI:</strong> {{ assessment.bmi }}</p>
    </div>

    <div v-if="assessment?.otherDetails" class="patient-info" style="margin-top: 20px; border-top: 1px solid var(--border); padding-top: 15px; display: block;">
        <p><strong>Dị ứng thuốc:</strong> 
            <template v-if="assessment.otherDetails.has_drug_allergy">
                Có
                <span v-if="assessment.otherDetails.drug_allergy_detail">
                    ({{ assessment.otherDetails.drug_allergy_detail }})
                </span>
            </template>
            <template v-else>Không</template>
        </p>
        <p style="margin-top: 8px"><strong>Giác quan (khiếm khuyết):</strong> {{ assessment.otherDetails.has_sensory_impairment ? 'Có' : 'Không' }}</p>
        <p style="margin-top: 8px"><strong>Tiểu không tự chủ:</strong> {{ assessment.otherDetails.has_incontinence ? 'Có' : 'Không' }}</p>
        <p style="margin-top: 8px"><strong>Nguy cơ loét:</strong> {{ assessment.otherDetails.has_pressure_ulcer_risk ? 'Có' : 'Không' }}</p>
        <p style="margin-top: 8px"><strong>Người chăm sóc:</strong> {{ assessment.otherDetails.has_caregiver ? 'Có' : 'Không' }}</p>
    </div>

    <h2>KẾT QUẢ TEST</h2>
    <table v-if="results" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
            <tr style="background-color: #f1f5f9;">
                <th style="padding: 12px 15px; text-align: left; border-bottom: 1px solid var(--border);">Lĩnh vực (Domains)</th>
                <th style="padding: 12px 15px; text-align: left; border-bottom: 1px solid var(--border);">Điểm bình thường / Tối đa</th>
                <th style="padding: 12px 15px; text-align: left; border-bottom: 1px solid var(--border);">Điểm bệnh nhân</th>
                <th style="padding: 12px 15px; text-align: left; border-bottom: 1px solid var(--border);">Kết quả</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid var(--border);">Đa bệnh lý (CCI)</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid var(--border);">0 / {{ results.cci.max }}</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid var(--border);">{{ results.cci.score }}</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid var(--border);" :class="results.cci.is_risk ? 'status-risk' : 'status-normal'">
                    {{ results.cci.status }}
                </td>
            </tr>
            <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid var(--border);">Sàng lọc sa sút trí tuệ (Mini-Cog)</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid var(--border);">{{ results.minicog.normal }} / {{ results.minicog.max }}</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid var(--border);">{{ results.minicog.score }}</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid var(--border);" :class="results.minicog.is_risk ? 'status-risk' : 'status-normal'">
                    {{ results.minicog.status }}
                </td>
            </tr>
            <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid var(--border);">Dinh dưỡng bệnh nhân (MNA)</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid var(--border);">{{ results.mna.normal }} / {{ results.mna.max }}</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid var(--border);">{{ results.mna.score }}</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid var(--border);" :class="results.mna.is_risk ? 'status-risk' : 'status-normal'">
                    {{ results.mna.status }}
                </td>
            </tr>
            <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid var(--border);">Suy yếu (CFS)</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid var(--border);">{{ results.cfs.normal }} / {{ results.cfs.max }}</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid var(--border);">{{ results.cfs.score }}</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid var(--border);" :class="results.cfs.is_risk ? 'status-risk' : 'status-normal'">
                    {{ results.cfs.status }} <br>
                    Mức độ: {{ results.cfs.interpretation }}
                </td>
            </tr>
            <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid var(--border);">Đánh giá nguy cơ té ngã (Morse)</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid var(--border);">{{ results.morse.normal }} / {{ results.morse.max }}</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid var(--border);">{{ results.morse.score }}</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid var(--border);" :class="results.morse.is_risk ? 'status-risk' : 'status-normal'">
                    {{ results.morse.status }} <br>
                    Mức độ: {{ results.morse.interpretation }}
                </td>
            </tr>
        </tbody>
    </table>

    <div v-if="results" class="section-interpretation" style="margin-top: 30px;">
        <h2>ĐÁNH GIÁ CHI TIẾT</h2>
        
        <div style="margin-top: 20px;">
            <h3>1. Tiền sử bản thân (CCI)</h3>
            <p><strong>Kết luận:</strong> {{ results.cci.interpretation }}</p>
            <p v-if="results.cci.activeCciList"><strong>Các bệnh lý ghi nhận:</strong> {{ results.cci.activeCciList }}</p>
            <p v-else><em>Không ghi nhận bệnh lý đồng diễn nào.</em></p>
        </div>

        <div style="margin-top: 20px;">
            <h3>2. Sàng lọc sa sút trí tuệ (Mini-Cog)</h3>
            <p><strong>Kết luận:</strong> {{ results.minicog.interpretation }}</p>
        </div>

        <div style="margin-top: 20px;">
            <h3>3. Dinh dưỡng (MNA)</h3>
            <p><strong>Kết luận:</strong> {{ results.mna.interpretation }}</p>
        </div>

        <div style="margin-top: 20px;">
            <h3>4. Suy yếu lâm sàng (CFS)</h3>
            <p><strong>Kết luận:</strong> {{ results.cfs.interpretation }}</p>
        </div>

        <div style="margin-top: 20px;">
            <h3>5. Nguy cơ té ngã (Morse)</h3>
            <p><strong>Kết luận:</strong> {{ results.morse.interpretation }}</p>
        </div>
    </div>

    <router-link to="/" class="btn" style="margin-top: 20px;">TẠO PHIẾU MỚI</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api';
const route = useRoute();
const assessment = ref<any>(null);
const results = ref<any>(null);
const loading = ref(true);

const fetchDetail = async () => {
    loading.value = true;
    try {
        const response = await api.get(`/assessments/${route.params.uuid}`);
        assessment.value = response.data.assessment;
        results.value = response.data.results;
    } catch (error) {
        console.error('Failed to fetch assessment detail:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(fetchDetail);
</script>

<style scoped>
.status-risk {
    color: #dc2626;
    font-weight: 600;
}
.status-normal {
    color: #16a34a;
    font-weight: 600;
}
h2 {
    font-size: 1.5rem;
    color: #1e40af;
    margin-top: 40px;
    border-bottom: 2px solid #f1f5f9;
    padding-bottom: 10px;
}
h3 {
    font-size: 1.1rem;
    color: #1e3a8a;
    margin-bottom: 8px;
}
</style>
