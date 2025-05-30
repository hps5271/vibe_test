// 메모 데이터를 저장할 배열
let memos = JSON.parse(localStorage.getItem('memos')) || [];

// 페이지 로드 시 저장된 메모 표시
window.onload = function() {
    displayMemos();
};

// 메모 추가 함수
function addMemo() {
    const titleInput = document.getElementById('memoTitle');
    const contentInput = document.getElementById('memoContent');
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    if (title === '' || content === '') {
        alert('제목과 내용을 모두 입력해주세요!');
        return;
    }
    
    const memo = {
        id: Date.now(),
        title: title,
        content: content,
        date: new Date().toLocaleString()
    };
    
    memos.push(memo);
    saveMemos();
    displayMemos();
    
    // 입력 필드 초기화
    titleInput.value = '';
    contentInput.value = '';
}

// 메모 삭제 함수
function deleteMemo(id) {
    memos = memos.filter(memo => memo.id !== id);
    saveMemos();
    displayMemos();
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
        memoElement.className = 'memo-item';
        memoElement.innerHTML = `
            <button class="delete-btn" onclick="deleteMemo(${memo.id})">삭제</button>
            <h3>${memo.title}</h3>
            <p>${memo.content}</p>
            <small>작성일: ${memo.date}</small>
        `;
        memoList.appendChild(memoElement);
    });
} 