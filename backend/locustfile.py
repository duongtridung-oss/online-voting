from locust import HttpUser, task, between
import random

class VoterUser(HttpUser):
    wait_time = between(0.1, 0.5) # Simulate wait time between requests
    
    def on_start(self):
        """
        Khởi tạo user trước khi bắt đầu load test.
        Mỗi luồng Locust sẽ tạo 1 user mới, đăng nhập và lấy token.
        """
        user_id = random.randint(100000, 999999)
        self.username = f"locust_user_{user_id}"
        self.email = f"locust_{user_id}@test.com"
        self.password = "password123"
        
        # 1. Đăng ký tài khoản (nếu cần, nhưng script này tạo mới luôn)
        self.client.post("/api/auth/register", json={
            "username": self.username,
            "email": self.email,
            "password": self.password,
            "full_name": f"Locust User {user_id}",
            "voter_id": f"VOTER{user_id}",
            "address": "Load Test Street"
        })
        
        # 2. Đăng nhập để lấy token
        resp = self.client.post("/api/auth/token", data={
            "username": self.username,
            "password": self.password
        })
        if resp.status_code == 200:
            self.token = resp.json().get("access_token")
        else:
            self.token = None

    @task
    def vote(self):
        """
        Hành động mô phỏng việc vote.
        Vì hệ thống đã cho phép cộng dồn vote, một user có thể vote nhiều lần!
        """
        if not self.token:
            return
            
        # TODO
        # Có thể lấy ID bằng cách xem trên trang Admin hoặc trong DB.
        poll_id = "6a36bb1c5ed20f9cb15ebcfa"
        options_list = ['opt_1781971740171_0', 'opt_1781971740171_1', 'opt_1781971740171_2', 'opt_1781971740171_3', 'opt_1781971740171_4', 'opt_1781971740171_5']
        option_id = random.choice(options_list)
        
        headers = {
            "Authorization": f"Bearer {self.token}"
        }
        
        # Thực hiện vote
        self.client.post(f"/api/polls/{poll_id}/vote", json={
            "option_id": option_id
        }, headers=headers)
