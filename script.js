// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyAaF3E1dP-B0_1Qcjfnz2eHXzpa1XqKxo8",
    authDomain: "vibe-test-backend.firebaseapp.com",
    projectId: "vibe-test-backend",
    storageBucket: "vibe-test-backend.firebasestorage.app",
    messagingSenderId: "464002821938",
    appId: "1:464002821938:web:2afbdd22e7eca23c6cf12b",
    databaseURL: "https://vibe-test-backend-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const todosRef = database.ref('todos');
const auth = firebase.auth();

// DOM 요소
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const welcomeMessage = document.getElementById('welcomeMessage');
const authButton = document.getElementById('authButton');

// 로그인 상태 감지
auth.onAuthStateChanged((user) => {
    if (user) {
        // 로그인 상태
        const displayName = user.displayName || user.email;
        welcomeMessage.textContent = `${displayName}님 반갑습니다`;
        welcomeMessage.style.display = 'inline-block';
        authButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> 로그아웃';
        authButton.onclick = () => {
            auth.signOut().then(() => {
                window.location.reload();
            });
        };
        // 입력 필드 활성화
        todoInput.placeholder = '할일을 입력하세요';
        todoInput.disabled = false;
        todoInput.style.opacity = '1';
    } else {
        // 로그아웃 상태
        welcomeMessage.style.display = 'none';
        authButton.innerHTML = '<i class="fas fa-user"></i> 로그인';
        authButton.onclick = () => {
            location.href = 'login.html';
        };
        // 입력 필드 비활성화
        todoInput.placeholder = '할일을 추가하려면 로그인이 필요합니다';
        todoInput.disabled = true;
        todoInput.style.opacity = '0.7';
    }
});

// 할일 추가 함수
function addTodo() {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('할일을 추가하려면 로그인이 필요합니다.');
        return;
    }

    const text = todoInput.value.trim();
    if (text) {
        const todo = {
            text: text,
            completed: false,
            important: false,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            createdBy: user.displayName || user.email,
            createdByEmail: user.email
        };
        
        todosRef.push(todo)
            .then(() => {
                todoInput.value = '';
            })
            .catch(error => {
                console.error('할일 추가 중 오류 발생:', error);
                alert('할일을 추가하는 중 오류가 발생했습니다.');
            });
    }
}

// 할일 삭제 함수
function deleteTodo(id) {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('로그인이 필요합니다.');
        return;
    }

    todosRef.child(id).once('value')
        .then((snapshot) => {
            const todo = snapshot.val();
            if (user.email === 'admin@okongolf.biz' || todo.createdByEmail === user.email) {
                return todosRef.child(id).remove();
            } else {
                alert('자신이 작성한 할일만 삭제할 수 있습니다.');
                return;
            }
        })
        .catch(error => {
            console.error('할일 삭제 중 오류 발생:', error);
            alert('할일을 삭제하는 중 오류가 발생했습니다.');
        });
}

// 할일 완료 상태 토글 함수
function toggleComplete(id) {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('로그인이 필요합니다.');
        return;
    }

    todosRef.child(id).once('value')
        .then((snapshot) => {
            const todo = snapshot.val();
            if (todo.createdByEmail !== user.email) {
                alert('자신이 작성한 할일만 수정할 수 있습니다.');
                return;
            }
            return todosRef.child(id).update({
                completed: !todo.completed
            });
        })
        .catch(error => {
            console.error('상태 변경 중 오류 발생:', error);
            alert('상태를 변경하는 중 오류가 발생했습니다.');
        });
}

// 중요 표시 토글 함수
function toggleImportant(id) {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('로그인이 필요합니다.');
        return;
    }

    todosRef.child(id).once('value')
        .then((snapshot) => {
            const todo = snapshot.val();
            if (todo.createdByEmail !== user.email) {
                alert('자신이 작성한 할일만 수정할 수 있습니다.');
                return;
            }
            return todosRef.child(id).update({
                important: !todo.important
            });
        })
        .catch(error => {
            console.error('중요도 변경 중 오류 발생:', error);
            alert('중요도를 변경하는 중 오류가 발생했습니다.');
        });
}

// 할일 목록 렌더링 함수
function renderTodos() {
    todoList.innerHTML = '';
    
    todosRef.on('value', (snapshot) => {
        todoList.innerHTML = '';
        const currentUser = firebase.auth().currentUser;
        const isAdmin = currentUser && currentUser.email === 'admin@okongolf.biz';
        
        snapshot.forEach((childSnapshot) => {
            const todo = childSnapshot.val();
            const todoId = childSnapshot.key;
            const isOwner = currentUser && (isAdmin || todo.createdByEmail === currentUser.email);
            
            const todoItem = document.createElement('div');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''} ${todo.important ? 'important' : ''}`;
            
            // 날짜 포맷팅
            const date = new Date(todo.createdAt);
            const formattedDate = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
            
            todoItem.innerHTML = `
                <div class="todo-actions">
                    <button class="important" onclick="toggleImportant('${todoId}')" ${!isOwner ? 'disabled' : ''}>
                        <i class="fas fa-star ${todo.important ? 'important-star' : ''}"></i>
                    </button>
                </div>
                <div class="todo-checkbox">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleComplete('${todoId}')" ${!isOwner ? 'disabled' : ''}>
                </div>
                <div class="todo-content">
                    <span class="todo-text">${todo.text}</span>
                    <div class="todo-meta">
                        <span class="todo-author">${todo.createdBy}</span>
                        <span class="todo-date">${formattedDate}</span>
                    </div>
                </div>
                <div class="todo-actions">
                    <button class="delete" onclick="deleteTodo('${todoId}')" ${!isOwner ? 'disabled' : ''}>
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            todoList.appendChild(todoItem);
        });
    });
}

// Enter 키로 할일 추가
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// 초기 렌더링
renderTodos();
