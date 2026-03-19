<template>
  <div style="padding: 40px 20px;">
    <div class="card" style="max-width: 400px; margin: 40px auto;">
        <h2 style="text-align: center; margin-bottom: 24px;">Đăng nhập</h2>
        <form @submit.prevent="handleLogin">
            <div v-if="error" class="error-message" style="margin-bottom: 15px; text-align: center;">{{ error }}</div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="text" id="email" v-model="email" required>
            </div>
            <div class="form-group">
                <label for="password">Mật khẩu</label>
                <input type="password" id="password" v-model="password" style="width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px;" required>
            </div>
            <button type="submit" class="btn" :disabled="submitting">{{ submitting ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP' }}</button>
        </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../auth';
import api from '../api';

const email = ref('admin@example.com');
const password = ref('admin123');
const submitting = ref(false);
const router = useRouter();
const { login } = useAuth();
const error = ref('');

const handleLogin = async () => {
    submitting.value = true;
    error.value = '';
    try {
        const response = await api.post('/auth/login', { 
            email: email.value, 
            password: password.value 
        });
        login(response.data.user || response.data);
        router.push('/assessments/management');
    } catch (err: any) {
        error.value = 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.';
    } finally {
        submitting.value = false;
    }
};
</script>
