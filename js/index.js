const { createApp } = Vue;

createApp({
    data() {
        return {
            apiUrl: "https://vue3-course-api.hexschool.io", // 冒號！
            user: {
                username: '',
                password: '',
            },
            error: ''
        }
    },
    methods: {
        // login
        login() {
            if (this.user.username === "") {
                this.error = "Please fill up your name";
            } else if (this.user.password === "") {
                this.error = "Please fill up your password";
            } else {
                this.error = '';
                axios.post(`${this.apiUrl}/admin/signin`, this.user)
                    .then(res => {
                        console.log(res.data);
                        if (!res.data.success) {
                            this.error = res.data.message;
                            this.user.password = "";
                            return;
                        } else {
                            const { token, expired } = res.data;
                            document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
                            window.location.href = "dashboard.html";
                        }
                    }).catch(error => {
                        console.error(error);
                    })
            }
        }
    }
}).mount('#app');

