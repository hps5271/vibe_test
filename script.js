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

// DOM 요소
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');

// 할일 추가 함수
function addTodo() {
    const text = todoInput.value.trim();
    if (text) {
        const todo = {
            text: text,
            completed: false,
            important: false,
            createdAt: firebase.database.ServerValue.TIMESTAMP
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
    todosRef.child(id).remove()
        .catch(error => {
            console.error('할일 삭제 중 오류 발생:', error);
            alert('할일을 삭제하는 중 오류가 발생했습니다.');
        });
}

// 할일 완료 상태 토글 함수
function toggleComplete(id) {
    todosRef.child(id).once('value')
        .then((snapshot) => {
            const todo = snapshot.val();
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
    todosRef.child(id).once('value')
        .then((snapshot) => {
            const todo = snapshot.val();
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
        snapshot.forEach((childSnapshot) => {
            const todo = childSnapshot.val();
            const todoId = childSnapshot.key;
            
            const todoItem = document.createElement('div');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''} ${todo.important ? 'important' : ''}`;
            
            todoItem.innerHTML = `
                <div class="todo-checkbox">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleComplete('${todoId}')">
                </div>
                <span class="todo-text">${todo.text}</span>
                <div class="todo-actions">
                    <button class="important" onclick="toggleImportant('${todoId}')">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="delete" onclick="deleteTodo('${todoId}')">
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