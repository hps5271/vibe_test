// 할일 데이터를 저장할 배열
let memos = JSON.parse(localStorage.getItem('memos')) || [];

// 페이지 로드 시 저장된 메모 표시
window.onload = function() {
    displayMemos();
};

// 메모 추가 함수
function addMemo() {
    const contentInput = document.getElementById('memoContent');
    const content = contentInput.value.trim();
    if (content === '') {
        alert('할 일을 입력해주세요!');
        return;
    }
    const memo = {
        id: Date.now(),
        content: content,
        checked: false,
        important: false
    };
    memos.unshift(memo);
    saveMemos();
    displayMemos();
    contentInput.value = '';
}

// 메모 삭제 함수
function deleteMemo(id) {
    memos = memos.filter(memo => memo.id !== id);
    saveMemos();
    displayMemos();
}

// 메모 체크 함수
function toggleCheck(id) {
    memos = memos.map(memo =>
        memo.id === id ? { ...memo, checked: !memo.checked } : memo
    );
    saveMemos();
    displayMemos();
}

// 메모 중요 토글 함수
function toggleImportant(id) {
    memos = memos.map(memo =>
        memo.id === id ? { ...memo, important: !memo.important } : memo
    );
    saveMemos();
    displayMemos();
}

// 메모 전체 삭제 함수
function clearAll() {
    if (memos.length === 0) return;
    if (confirm('모든 할 일을 삭제하시겠습니까?')) {
        memos = [];
        saveMemos();
        displayMemos();
    }
}

// 메모 저장 함수
function saveMemos() {
    localStorage.setItem('memos', JSON.stringify(memos));
}

// 메모 표시 함수
function displayMemos() {
    const memoList = document.getElementById('memoList');
    memoList.innerHTML = '';
    memos.forEach(memo => {
        const memoElement = document.createElement('div');
        memoElement.className = 'memo-item' + (memo.checked ? ' checked' : '');
        memoElement.innerHTML = `
            <button class="check-btn" onclick="toggleCheck(${memo.id})">${memo.checked ? '✔️' : '✓'}</button>
            <span class="memo-text">${memo.content}</span>
            <button class="delete-btn" onclick="deleteMemo(${memo.id})">🗑️</button>
            <button class="star-btn${memo.important ? ' important' : ''}" onclick="toggleImportant(${memo.id})">★</button>
        `;
        memoList.appendChild(memoElement);
    });
} 