import { reactive, computed } from 'vue';

const state = reactive({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
});

export const isLoggedIn = computed(() => !!state.user);
export const user = computed(() => state.user);

export const useAuth = () => {
    const login = (userData: any) => {
        state.user = userData;
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        state.user = null;
        localStorage.removeItem('user');
    };

    return {
        isLoggedIn,
        user,
        login,
        logout,
    };
};
