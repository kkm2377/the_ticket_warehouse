// API 엔드포인트
const API_URL = 'http://localhost:5000/api';

// DOM 요소
const itemForm = document.getElementById('itemForm');
const itemList = document.getElementById('itemList');
const crawlConfigForm = document.getElementById('crawlConfigForm');
const crawlConfigList = document.getElementById('crawlConfigList');
const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toastTitle');
const toastMessage = document.getElementById('toastMessage');
const notificationType = document.getElementById('notificationType');
const emailField = document.getElementById('emailField');
const telegramField = document.getElementById('telegramField');

// 토스트 객체 초기화
const bsToast = new bootstrap.Toast(toast);

// 아이템 목록 로드
async function loadItems() {
    try {
        const response = await fetch(`${API_URL}/items`);
        const items = await response.json();
        
        itemList.innerHTML = items.map(item => `
            <div class="list-group-item">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${item.title}</h5>
                    <small>${new Date(item.created_at).toLocaleDateString()}</small>
                </div>
                <p class="mb-1">${item.description || '설명 없음'}</p>
                <small>상태: ${item.status}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('아이템을 불러오는 중 오류가 발생했습니다:', error);
        alert('아이템을 불러오는데 실패했습니다.');
    }
}

// 새 아이템 생성
async function createItem(data) {
    try {
        const response = await fetch(`${API_URL}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('아이템 생성에 실패했습니다.');
        }

        await loadItems(); // 목록 새로고침
        return true;
    } catch (error) {
        console.error('아이템 생성 중 오류가 발생했습니다:', error);
        alert('아이템 생성에 실패했습니다.');
        return false;
    }
}

// 알림 방식 변경 시 입력 필드 전환
notificationType.addEventListener('change', (e) => {
    if (e.target.value === 'email') {
        emailField.style.display = 'block';
        telegramField.style.display = 'none';
        document.getElementById('notificationTarget').type = 'email';
        document.getElementById('notificationTarget').required = true;
        document.getElementById('telegramTarget').required = false;
    } else {
        emailField.style.display = 'none';
        telegramField.style.display = 'block';
        document.getElementById('notificationTarget').type = 'text';
        document.getElementById('telegramTarget').required = true;
        document.getElementById('notificationTarget').required = false;
    }
});

// 알림 표시 함수
function showToast(title, message, isError = false) {
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toast.classList.toggle('bg-danger', isError);
    toast.classList.toggle('text-white', isError);
    bsToast.show();
}

// 크롤링 설정 목록 로드
async function loadCrawlConfigs() {
    try {
        const response = await fetch(`${API_URL}/crawl-configs`);
        const configs = await response.json();
        
        crawlConfigList.innerHTML = configs.map(config => `
            <div class="list-group-item" data-id="${config.id}">
                <div class="d-flex w-100 justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1">${config.name}</h6>
                        <p class="mb-1 small text-truncate" style="max-width: 500px;">
                            <a href="${config.url}" target="_blank">${config.url}</a>
                        </p>
                        <small>
                            확인 주기: ${config.interval}분 | 
                            알림: ${config.notification_type === 'email' ? '이메일' : '텔레그램'} | 
                            상태: ${config.is_active ? '활성' : '비활성'}
                        </small>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary toggle-active" data-id="${config.id}" data-active="${config.is_active}">
                            ${config.is_active ? '비활성화' : '활성화'}
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-config" data-id="${config.id}">삭제</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // 이벤트 리스너 추가
        document.querySelectorAll('.toggle-active').forEach(button => {
            button.addEventListener('click', handleToggleActive);
        });
        
        document.querySelectorAll('.delete-config').forEach(button => {
            button.addEventListener('click', handleDeleteConfig);
        });
    } catch (error) {
        console.error('설정을 불러오는 중 오류가 발생했습니다:', error);
        showToast('오류', '설정을 불러오는데 실패했습니다.', true);
    }
}

// 새 크롤링 설정 생성
async function createCrawlConfig(data) {
    try {
        const response = await fetch(`${API_URL}/crawl-configs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('설정 생성에 실패했습니다.');
        }

        await loadCrawlConfigs(); // 목록 새로고침
        showToast('성공', '새 모니터링 설정이 추가되었습니다.');
        return true;
    } catch (error) {
        console.error('설정 생성 중 오류가 발생했습니다:', error);
        showToast('오류', '설정 생성에 실패했습니다.', true);
        return false;
    }
}

// 크롤링 설정 삭제
async function deleteCrawlConfig(configId) {
    try {
        const response = await fetch(`${API_URL}/crawl-configs/${configId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('설정 삭제에 실패했습니다.');
        }

        await loadCrawlConfigs(); // 목록 새로고침
        showToast('성공', '모니터링 설정이 삭제되었습니다.');
    } catch (error) {
        console.error('설정 삭제 중 오류가 발생했습니다:', error);
        showToast('오류', '설정 삭제에 실패했습니다.', true);
    }
}

// 크롤링 설정 활성/비활성 토글
async function toggleCrawlConfig(configId, isActive) {
    try {
        const response = await fetch(`${API_URL}/crawl-configs/${configId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ is_active: !isActive })
        });
        
        if (!response.ok) {
            throw new Error('설정 수정에 실패했습니다.');
        }

        await loadCrawlConfigs(); // 목록 새로고침
        showToast('성공', `모니터링이 ${!isActive ? '활성화' : '비활성화'}되었습니다.`);
    } catch (error) {
        console.error('설정 수정 중 오류가 발생했습니다:', error);
        showToast('오류', '설정 수정에 실패했습니다.', true);
    }
}

// 이벤트 핸들러
async function handleToggleActive(e) {
    const button = e.currentTarget;
    const configId = button.dataset.id;
    const isActive = button.dataset.active === 'true';
    await toggleCrawlConfig(configId, isActive);
}

async function handleDeleteConfig(e) {
    if (confirm('정말 이 모니터링 설정을 삭제하시겠습니까?')) {
        const configId = e.currentTarget.dataset.id;
        await deleteCrawlConfig(configId);
    }
}

// 이벤트 리스너
itemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    
    const success = await createItem({ title, description });
    if (success) {
        itemForm.reset(); // 폼 초기화
    }
});

// 이벤트 리스너
crawlConfigForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const notificationType = document.getElementById('notificationType').value;
    const notificationTarget = notificationType === 'email' 
        ? document.getElementById('notificationTarget').value 
        : document.getElementById('telegramTarget').value;
    
    const data = {
        name: document.getElementById('name').value,
        url: document.getElementById('url').value,
        interval: parseInt(document.getElementById('interval').value),
        notification_type: notificationType,
        notification_target: notificationTarget,
        is_active: document.getElementById('isActive').checked
    };
    
    const success = await createCrawlConfig(data);
    if (success) {
        crawlConfigForm.reset();
    }
});

// 초기 로드
document.addEventListener('DOMContentLoaded', loadItems);
document.addEventListener('DOMContentLoaded', loadCrawlConfigs); 