<template>
  <div class="container">
    <header>
      <h1>Bệnh Viện Đà Nẵng - Khoa Lão</h1>
      <p>PHIẾU ĐÁNH GIÁ LÃO KHOA TOÀN DIỆN</p>
    </header>

    <form @submit.prevent="handleSubmit">
      <!-- I. THÔNG TIN BỆNH NHÂN -->
      <div class="card">
        <h2>I. Thông tin bệnh nhân</h2>
        <div class="grid">
          <div class="form-group">
            <label>Họ và tên bệnh nhân</label>
            <input type="text" v-model="form.main.patient_name" :class="{ 'is-invalid': errors.main?.patient_name }" placeholder="Nhập họ tên...">
            <span v-if="errors.main?.patient_name" class="error-message">{{ errors.main.patient_name }}</span>
          </div>
          <div class="form-group">
            <label>Năm sinh</label>
            <input type="number" v-model.number="form.main.birth_year" :class="{ 'is-invalid': errors.main?.birth_year }" placeholder="VD: 1950">
            <span v-if="errors.main?.birth_year" class="error-message">{{ errors.main.birth_year }}</span>
          </div>
          <div class="form-group">
            <label>Giới tính</label>
            <select v-model="form.main.gender" class="custom-select" :class="{ 'is-invalid': errors.main?.gender }">
              <option value="">Chọn giới tính</option>
              <option value="1">Nam</option>
              <option value="2">Nữ</option>
            </select>
            <span v-if="errors.main?.gender" class="error-message">{{ errors.main.gender }}</span>
          </div>
        </div>
        <div class="grid">
            <div class="form-group">
                <label>Số điện thoại người nhà cần liên lạc</label>
                <input type="text" v-model="form.main.phone_number" :class="{ 'is-invalid': errors.main?.phone_number }">
                <span v-if="errors.main?.phone_number" class="error-message">{{ errors.main.phone_number }}</span>
            </div>
            <div class="form-group">
                <label>Công việc trước đây</label>
                <input type="text" v-model="form.main.previous_job" :class="{ 'is-invalid': errors.main?.previous_job }">
                <span v-if="errors.main?.previous_job" class="error-message">{{ errors.main.previous_job }}</span>
            </div>
        </div>
        <div class="grid">
          <div class="form-group">
            <label>Chiều cao (m)</label>
            <input type="number" step="0.01" v-model.number="form.main.height" @input="calculateBMI" :class="{ 'is-invalid': errors.main?.height }" placeholder="VD: 1.65">
            <span v-if="errors.main?.height" class="error-message">{{ errors.main.height }}</span>
          </div>
          <div class="form-group">
            <label>Cân nặng (kg)</label>
            <input type="number" step="0.1" v-model.number="form.main.weight" @input="calculateBMI" :class="{ 'is-invalid': errors.main?.weight }" placeholder="VD: 60">
            <span v-if="errors.main?.weight" class="error-message">{{ errors.main.weight }}</span>
          </div>
          <div class="form-group">
            <label>BMI</label>
            <input type="number" step="0.1" v-model.number="form.main.bmi" :class="{ 'is-invalid': errors.main?.bmi }" readonly>
            <span v-if="errors.main?.bmi" class="error-message">{{ errors.main.bmi }}</span>
          </div>
        </div>

        <div class="question-list">
            <table class="other-details-table">
                <tbody>
                    <tr>
                        <td style="width: 25%; font-weight: 600;"><span class="check-icon">✓</span> Dị ứng thuốc:</td>
                        <td style="width: 45%;">Có tiền sử dị ứng thuốc hay không?</td>
                        <td style="width: 30%;">
                            <div class="radio-group" :class="{ 'is-invalid': errors.other?.has_drug_allergy }">
                                <label class="checkbox-item"><input type="radio" v-model="form.other.has_drug_allergy" value="1"> Có</label>
                                <label class="checkbox-item"><input type="radio" v-model="form.other.has_drug_allergy" value="0"> Không</label>
                            </div>
                            <span v-if="errors.other?.has_drug_allergy" class="error-message">{{ errors.other.has_drug_allergy }}</span>
                        </td>
                    </tr>
                    <tr v-if="form.other.has_drug_allergy === '1'">
                        <td colspan="2" style="text-align: right; padding-right: 20px; font-style: italic; color: var(--text-light);">Nếu có: loại thuốc dị ứng:</td>
                        <td>
                            <input type="text" v-model="form.other.drug_allergy_detail" :class="{ 'is-invalid': errors.other?.drug_allergy_detail }" placeholder="Nhập tên thuốc...">
                            <span v-if="errors.other?.drug_allergy_detail" class="error-message">{{ errors.other.drug_allergy_detail }}</span>
                        </td>
                    </tr>
                    <tr>
                      <td style="font-weight: 600;"><span class="check-icon">✓</span> Giác quan:</td>
                      <td>Nghe kém hoặc nhìn kém?</td>
                      <td>
                        <div class="radio-group" :class="{ 'is-invalid': errors.other?.has_sensory_impairment }">
                          <label class="checkbox-item"><input type="radio" v-model="form.other.has_sensory_impairment" value="1"> Có</label>
                          <label class="checkbox-item"><input type="radio" v-model="form.other.has_sensory_impairment" value="0"> Không</label>
                        </div>
                        <span v-if="errors.other?.has_sensory_impairment" class="error-message">{{ errors.other.has_sensory_impairment }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="font-weight: 600;"><span class="check-icon">✓</span> Tiểu không tự chủ:</td>
                      <td>Khó kiểm soát tiểu tiện?</td>
                      <td>
                        <div class="radio-group" :class="{ 'is-invalid': errors.other?.has_incontinence }">
                          <label class="checkbox-item"><input type="radio" v-model="form.other.has_incontinence" value="1"> Có</label>
                          <label class="checkbox-item"><input type="radio" v-model="form.other.has_incontinence" value="0"> Không</label>
                        </div>
                        <span v-if="errors.other?.has_incontinence" class="error-message">{{ errors.other.has_incontinence }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="font-weight: 600;"><span class="check-icon">✓</span> Nguy cơ loét:</td>
                      <td>Hạn chế vận động, nằm nhiều hoặc đang loét?</td>
                      <td>
                        <div class="radio-group" :class="{ 'is-invalid': errors.other?.has_pressure_ulcer_risk }">
                          <label class="checkbox-item"><input type="radio" v-model="form.other.has_pressure_ulcer_risk" value="1"> Có</label>
                          <label class="checkbox-item"><input type="radio" v-model="form.other.has_pressure_ulcer_risk" value="0"> Không</label>
                        </div>
                        <span v-if="errors.other?.has_pressure_ulcer_risk" class="error-message">{{ errors.other.has_pressure_ulcer_risk }}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="font-weight: 600;"><span class="check-icon">✓</span> Hoàn cảnh xã hội:</td>
                      <td>Có người chăm sóc khi cần thiết?</td>
                      <td>
                        <div class="radio-group" :class="{ 'is-invalid': errors.other?.has_caregiver }">
                          <label class="checkbox-item"><input type="radio" v-model="form.other.has_caregiver" value="1"> Có</label>
                          <label class="checkbox-item"><input type="radio" v-model="form.other.has_caregiver" value="0"> Không</label>
                        </div>
                        <span v-if="errors.other?.has_caregiver" class="error-message">{{ errors.other.has_caregiver }}</span>
                      </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

      <!-- II. TIỀN SỬ BẢN THÂN (CCI) -->
      <div class="card">
          <h2>II. Tiền sử bản thân (CCI)</h2>
          <p class="section-title">Các bệnh hiện mắc</p>
          <div class="checkbox-group">
            <label v-for="(label, key) in cciLabels" :key="key" class="checkbox-item">
              <input type="checkbox" v-model="form.cci[key]"> {{ label }}
            </label>
          </div>
      </div>

      <!-- III. MINI-COG -->
      <div class="card">
        <h2>III. Đánh giá sàng lọc sa sút trí tuệ (Mini-Cog)</h2>
        <div class="form-group">
          <p class="section-title">1. Hãy nhớ 3 từ sau:</p>
          <div v-if="showMemoryContent">
            <div class="minicog-memory-row">
              <div class="memory-item">
                <img src="/images/banana.png" alt="Chuối">
                <p>Trái chuối</p>
              </div>
              <div class="memory-item">
                <img src="/images/dog.png" alt="Chó">
                <p>Con chó</p>
              </div>
              <div class="memory-item">
                <img src="/images/cyclebike.png" alt="Xe đạp">
                <p>Xe đạp</p>
              </div>
            </div>
            <button type="button" @click="toggleMemory(false)" class="btn" style="background: #10b981; margin: 0 auto; display: block; width: auto; padding: 10px 24px;">Đã nhớ</button>
          </div>
          <button v-else type="button" @click="toggleMemory(true)" class="btn" style="background: #6366f1; margin: 10px auto 0; display: block; width: auto; padding: 10px 24px;">Xem lại hình ảnh</button>
        </div>

        <div class="form-group">
          <p class="section-title">2. Đâu là cái đồng hồ chỉ 11 giờ 10 phút (chọn chính xác 2 điểm)</p>
          <div class="minicog-grid" :class="{ 'is-invalid': errors.minicog?.clock_selected }">
            <label v-for="i in 9" :key="'clock-' + i" class="grid-item">
              <img :src="'/images/clock-' + i + '.png'" :alt="'Clock ' + i">
              <input type="radio" v-model="form.minicog.clock_selected" :value="i.toString()">
            </label>
          </div>
          <span v-if="errors.minicog?.clock_selected" class="error-message">{{ errors.minicog.clock_selected }}</span>
        </div>

        <div class="form-group">
          <p class="section-title">3. Nhắc lại 3 từ đã nhớ lúc đầu (Mỗi câu đúng 1 điểm)</p>
          <div class="minicog-grid" :class="{ 'is-invalid': errors.minicog?.recall }">
            <label v-for="item in recallItems" :key="item.id" class="grid-item">
              <img :src="item.img" :alt="item.label">
              <p style="font-size: 0.8rem; margin: 5px 0;">{{ item.label }}</p>
              <input type="checkbox" v-model="form.minicog.recall" :value="item.id">
            </label>
          </div>
          <span v-if="errors.minicog?.recall" class="error-message">{{ errors.minicog.recall }}</span>
        </div>
      </div>

      <!-- IV. MNA -->
      <div class="card">
        <h2>IV. Bảng đánh giá Tầm soát dinh dưỡng tối thiểu dành cho bệnh nhân lớn tuổi MNA (Mini Nutritional Assessment)</h2>
        <div class="question-list">
          <div v-for="(q, key) in mnaQuestions" :key="key" class="question-block">
            <label class="question-label">{{ q.label }}</label>
            <div class="radio-vertical" :class="{ 'is-invalid': errors.mna?.[key] }">
              <label v-for="opt in q.options" :key="opt.value" class="checkbox-item">
                <input type="radio" v-model="form.mna[key]" :value="opt.value"> {{ opt.text }}
              </label>
            </div>
            <span v-if="errors.mna?.[key]" class="error-message">{{ errors.mna[key] }}</span>
          </div>
        </div>
      </div>

      <!-- V. CFS -->
      <div class="card">
        <h2>V. Thang điểm đánh giá suy yếu lâm sàng</h2>
        <div class="form-group">
          <p class="section-title">Hãy nhìn các ảnh, chọn 1 tấm ảnh mô tả tình hình sức khỏe của bệnh nhân hiện tại</p>
          <div class="minicog-grid cfs-grid" :class="{ 'is-invalid': errors.cfs?.cfs_level }">
            <label v-for="i in 9" :key="'cfs-' + i" class="grid-item">
              <img :src="'/images/level-' + i + '.png'" :alt="'Level ' + i">
              <p style="font-size: 0.8rem; font-weight: 600; margin-bottom: 8px;">Mức {{ i }}</p>
              <input type="radio" v-model="form.cfs.cfs_level" :value="i.toString()">
            </label>
          </div>
          <span v-if="errors.cfs?.cfs_level" class="error-message">{{ errors.cfs.cfs_level }}</span>
        </div>
      </div>

      <!-- VI. MORSE -->
      <div class="card">
        <h2>VI. Đánh giá nguy cơ ngã (Morse)</h2>
        <div class="question-list">
          <div v-for="(q, key) in morseQuestions" :key="key" class="question-item" style="flex-direction: column; align-items: flex-start;">
            <label class="question-label">{{ q.label }}</label>
            <div class="radio-options" :class="{ 'is-invalid': errors.morse?.[key] }" style="flex-direction: column; gap: 8px; width: 100%;">
              <label v-for="opt in q.options" :key="opt.value" class="checkbox-item" style="width: 100%;">
                <input type="radio" v-model="form.morse[key]" :value="opt.value"> {{ opt.text }}
              </label>
            </div>
            <span v-if="errors.morse?.[key]" class="error-message">{{ errors.morse[key] }}</span>
          </div>
        </div>
      </div>

      <button type="submit" class="btn" :disabled="submitting">
        {{ submitting ? 'ĐANG LƯU...' : 'LƯU PHIẾU ĐÁNH GIÁ' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

const router = useRouter();
const submitting = ref(false);
const errors = ref<any>({});
const showMemoryContent = ref(true);

const form = reactive<any>({
  main: {
    patient_name: '',
    birth_year: '',
    gender: '',
    phone_number: '',
    previous_job: '',
    height: '',
    weight: '',
    bmi: '',
  },
  other: {
    has_drug_allergy: '',
    drug_allergy_detail: '',
    has_sensory_impairment: '',
    has_incontinence: '',
    has_pressure_ulcer_risk: '',
    has_caregiver: '',
  },
  cci: {},
  minicog: {
    clock_selected: '',
    recall: [],
  },
  mna: {
    giam_an_uong: '',
    sut_can: '',
    kha_nang_van_dong: '',
    stress_tam_ly: '',
    van_de_tam_than_kinh: '',
    bmi_score: '',
  },
  cfs: {
    cfs_level: '',
  },
  morse: {
    tien_su_te_nga: '',
    benh_ly_di_kem: '',
    duong_truyen_dich: '',
    ho_tro_di_lai: '',
    bat_thuong_di_chuyen: '',
    tinh_trang_tinh_than: '',
  }
});

const cciLabels: any = {
  nhoi_mau_co_tim: 'Nhồi máu cơ tim (1đ)',
  suy_tim: 'Suy tim (1đ)',
  benh_mach_mau_ngoai_vi: 'Bệnh mạch máu ngoại vi (1đ)',
  benh_mach_nao: 'Bệnh mạch não (CVA hoặc TIA) (1đ)',
  hen_phe_quan_copd: 'Hen phế quản, COPD (1đ)',
  dai_thao_duong_chua_bien_chung: 'Đái tháo đường (chưa biến chứng) (1đ)',
  tram_cam: 'Trầm cảm (1đ)',
  dung_thuoc_chong_dong_mau: 'Dòng thuốc chống đông máu (1đ)',
  alzheimer_suy_giam_tri_nho: 'Alzheimer hay suy giảm trí nhớ (1đ)',
  benh_mo_lien_ket: 'Bệnh mô liên kết (1đ)',
  tang_huy_ap: 'Tăng huyết áp (1đ)',
  liet_nua_nguoi: 'Liệt nửa người (2đ)',
  dai_thao_duong_co_bien_chung: 'Đái tháo đường có biến chứng (2đ)',
  benh_than_trung_binh_nang: 'Bệnh thận mức độ trung bình/nặng (2đ)',
  ung_thu_tai_cho: 'Ung thư (khối u tại chỗ chưa di căn) (2đ)',
  benh_gan_man_tinh_vua_nang: 'Bệnh gan mạn tính vừa đến nặng (3đ)',
  ung_thu_di_can: 'Ung thư di căn (6đ)',
  hiv_aids: 'HIV hoặc AIDS (6đ)',
};

const recallItems = [
  { id: 'cat', label: 'Con mèo', img: '/images/cat.png' },
  { id: 'orange', label: 'Trái cam', img: '/images/orange.png' },
  { id: 'cyclo', label: 'Xích lô', img: '/images/cyclo.png' },
  { id: 'tiger', label: 'Con hổ', img: '/images/tiger.png' },
  { id: 'banana', label: 'Trái chuối', img: '/images/banana.png' },
  { id: 'dog', label: 'Con chó', img: '/images/dog.png' },
  { id: 'motorbike', label: 'Xe máy', img: '/images/motorbike.png' },
  { id: 'apple', label: 'Trái táo', img: '/images/apple.png' },
  { id: 'cyclebike', label: 'Xe đạp', img: '/images/cyclebike.png' },
];

const mnaQuestions = {
  giam_an_uong: {
    label: '1. Giảm khả năng ăn uống/3 tháng qua do chán ăn, vấn đề tiêu hóa, nhai, nuốt khó',
    options: [
      { text: 'Chán ăn nghiêm trọng (0đ)', value: '0' },
      { text: 'Trung bình (1đ)', value: '1' },
      { text: 'Không chán ăn (2đ)', value: '2' },
    ]
  },
  sut_can: {
    label: '2. Sút cân trong 3 tháng qua',
    options: [
      { text: 'Giảm > 3kg (0đ)', value: '0' },
      { text: 'Không biết (1đ)', value: '1' },
      { text: 'Giảm 1-3 kg (2đ)', value: '2' },
      { text: 'Không giảm (3đ)', value: '3' },
    ]
  },
  kha_nang_van_dong: {
    label: '3. Khả năng vận động',
    options: [
      { text: 'Tại giường/ghế (0đ)', value: '0' },
      { text: 'Trong nhà (1đ)', value: '1' },
      { text: 'Ra ngoài được (2đ)', value: '2' },
    ]
  },
  stress_tam_ly: {
    label: '4. Stress thể chất hoặc bệnh lý cấp tính trong 3 tháng qua',
    options: [
      { text: 'Có (0đ)', value: '0' },
      { text: 'Không (2đ)', value: '2' },
    ]
  },
  van_de_tam_than_kinh: {
    label: '5. Vấn đề về tâm thần kinh',
    options: [
      { text: 'Sa sút/Trầm cảm nặng (0đ)', value: '0' },
      { text: 'Sa sút nhẹ (1đ)', value: '1' },
      { text: 'Không có vấn đề (2đ)', value: '2' },
    ]
  },
  bmi_score: {
    label: '6. Chỉ số BMI (Điểm số tự động dựa trên BMI ở Phần I)',
    options: [
      { text: 'BMI < 19 (0đ)', value: '0' },
      { text: '19 ≤ BMI < 21 (1đ)', value: '1' },
      { text: '21 ≤ BMI < 23 (2đ)', value: '2' },
      { text: 'BMI ≥ 23 (3đ)', value: '3' },
    ]
  }
};

const morseQuestions = {
  tien_su_te_nga: {
    label: '1. Tiền sử té ngã trong vòng 3 tháng qua',
    options: [
      { text: 'Không (0đ)', value: '0' },
      { text: 'Có (25đ)', value: '25' },
    ]
  },
  benh_ly_di_kem: {
    label: '2. Có các chẩn đoán bệnh lý đi kèm',
    options: [
      { text: 'Không (0đ)', value: '0' },
      { text: 'Có (15đ)', value: '15' },
    ]
  },
  duong_truyen_dich: {
    label: '3. Có đường truyền dịch tĩnh mạch/kim luồn',
    options: [
      { text: 'Không (0đ)', value: '0' },
      { text: 'Có (20đ)', value: '20' },
    ]
  },
  ho_tro_di_lai: {
    label: '4. Hỗ trợ đi lại',
    options: [
      { text: 'Đi lại không cần hỗ trợ/nghỉ ngơi tại giường/ điều dưỡng hỗ trợ (0đ)', value: '0' },
      { text: 'Xe lăn/nạng chống/khung tập đi (15đ)', value: '15' },
      { text: 'Phải vịn vào bàn ghế/tường/thành giường (30đ)', value: '30' },
    ]
  },
  bat_thuong_di_chuyen: {
    label: '5. Kiểu đi/Bất thường di chuyển',
    options: [
      { text: 'Bình thường/nằm trên giường/bất động (0đ)', value: '0' },
      { text: 'Yếu (10đ)', value: '10' },
      { text: 'Không thăng bằng (20đ)', value: '20' },
    ]
  },
  tinh_trang_tinh_than: {
    label: '6. Tình trạng tinh thần',
    options: [
      { text: 'Định hướng được bản thân (0đ)', value: '0' },
      { text: 'Quên, lú lẫn (15đ)', value: '15' },
    ]
  }
};

const calculateBMI = () => {
  const h = parseFloat(form.main.height);
  const w = parseFloat(form.main.weight);
  if (h > 0 && w > 0) {
    const bmi = w / (h * h);
    form.main.bmi = parseFloat(bmi.toFixed(1));

    // Auto-select MNA BMI score
    if (bmi >= 23) form.mna.bmi_score = "3";
    else if (bmi >= 21) form.mna.bmi_score = "2";
    else if (bmi >= 19) form.mna.bmi_score = "1";
    else form.mna.bmi_score = "0";
  }
};

const toggleMemory = (show: boolean) => {
  showMemoryContent.value = show;
};

const handleSubmit = async () => {
    errors.value = {};
    submitting.value = true;
    try {
        const payload = {
            main: form.main,
            other: form.other,
            cci: form.cci,
            minicog: form.minicog,
            mna: form.mna,
            cfs: form.cfs,
            morse: form.morse,
        };
        const response = await api.post('/assessments', payload);
        router.push(`/assessments/${response.data.uuid}`);
    } catch (error: any) {
        if (error.response?.status === 400 && error.response?.data?.errorMessages) {
            errors.value = error.response.data.errorMessages;
            scrollToError();
        } else {
            console.error('Failed to save assessment:', error);
            alert('Có lỗi xảy ra khi lưu phiếu. Vui lòng thử lại.');
        }
    } finally {
        submitting.value = false;
    }
};

const scrollToError = () => {
    setTimeout(() => {
        const firstError = document.querySelector('.is-invalid, .error-message');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
};
</script>

<style scoped>
.container {
    max-width: 900px;
    margin: 0 auto;
}

header {
    text-align: center;
    margin-bottom: 40px;
}

header h1 {
    font-size: 2.25rem;
    font-weight: 700;
    color: #1e3a8a;
    margin-bottom: 10px;
}

header p {
    color: var(--text-light);
    font-size: 1.1rem;
}

.card {
    background: #ffffff;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    margin-bottom: 24px;
    border: 1px solid var(--border);
}

.card h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 2px solid #f8fafc;
    color: #1e40af;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.form-group {
    margin-bottom: 16px;
}

label {
    display: block;
    font-weight: 500;
    margin-bottom: 6px;
    font-size: 0.95rem;
}

input[type="text"],
input[type="number"],
select {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.custom-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='black'%3E%3Cpath d='M5 7l5 5 5-5'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 20px;
}

.is-invalid {
    border-color: #ef4444 !important;
}

.radio-group.is-invalid {
    border: 1px solid #ef4444;
    padding: 10px;
    border-radius: 8px;
    background: #fef2f2;
}

.error-message {
    color: #ef4444;
    font-size: 0.85rem;
    margin-top: 6px;
    font-weight: 600;
    display: block;
}

.section-title {
    background: #eff6ff;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #1d4ed8;
}

.minicog-memory-row {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 20px 0;
    gap: 20px;
}

.memory-item {
    text-align: center;
}

.memory-item img {
    width: 100%;
    height: 160px;
    object-fit: contain;
    margin-bottom: 10px;
}

.minicog-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin: 20px 0;
}

.minicog-grid input {
    width: 18px;
    height: 18px;
}

.grid-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f8fafc;
    padding: 15px;
    border-radius: 12px;
    border: 1px solid var(--border);
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
}

.grid-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: var(--primary);
}

.grid-item img {
    width: 100%;
    height: 120px;
    object-fit: contain;
    margin-bottom: 12px;
}

.cfs-grid .grid-item img {
    height: 220px;
}

.other-details-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

.other-details-table td {
    padding: 12px;
    border: 1px solid var(--border);
    vertical-align: middle;
}

.check-icon {
    color: #10b981;
    font-weight: bold;
    margin-right: 8px;
}

.radio-group {
    display: flex;
    gap: 15px;
}

.checkbox-group {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
}

.checkbox-item {
    display: flex;
    align-items: center;
    background: #fbfcfd;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid var(--border);
    cursor: pointer;
    transition: background 0.2s;
}

.width-item {
    width: 18px;
    height: 18px;
}

.checkbox-item input {
    margin-right: 12px;
    width: 18px;
    height: 18px;
}

.question-block {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
}

.question-label {
    margin-bottom: 12px;
    font-weight: 600;
    color: var(--text);
    font-size: 1rem;
}

.radio-vertical {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
}

.btn {
    background: var(--primary);
    color: white;
    padding: 14px 28px;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    width: 100%;
    margin-top: 20px;
}

.btn:hover {
    background: var(--primary-hover);
}

@media (max-width: 640px) {
    .minicog-grid {
        grid-template-columns: 1fr;
    }
}
</style>
