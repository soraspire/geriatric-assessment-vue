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

const email = ref('tho@gmail.com');
const password = ref('Tho@1234');
const submitting = ref(false);
const router = useRouter();
const { login } = useAuth();
const error = ref('');

const handleLogin = async () => {
    submitting.value = true;
    error.value = '';
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (email.value === 'tho@gmail.com' && password.value === 'Tho@1234') {
        const mockUser = {
            id: 1,
            email: 'tho@gmail.com',
            name: 'Tho'
        };
        login(mockUser);
        router.push('/assessments/management');
    } else {
        error.value = 'Đăng nhập thất bại. Email hoặc mật khẩu không chính xác.';
    }
    
    submitting.value = false;
};
</script>
