let current_board_count = 0;
let current_board;
let current_board_id;
let current_task;
let current_subtasks;
let all_boards_data;
let current_task_id;
let subtasks_to_add = [];
let counter = { todo: 0, doing: 0, done: 0 };
let filter = { todo: 0, doing: 0, done: 0 };
let isUpdateAvailable;
let isTaskUpdateAvailable;
let check_count = 0;

const loader_css = `<div></div><div style="display:flex; justify-content: center;              align-items:center; margin-top:150px">
        <div class="loader"></div>
    </div> <div></div>`;
    
const url = "https://quiz-server-27y4.onrender.com/Task";
const token = localStorage.getItem("token");
const task_container = document.querySelector(".task_container");
const board_count = document.getElementById("board_count");
const all_boards = document.getElementById("all_boards");
const current_board_name = document.getElementById("current_board_name");
const todo_count = document.getElementById("todo-count");
const doing_count = document.getElementById("doing-count");
const done_count = document.getElementById("done-count");
const Add_task_form = document.querySelector(".Add_task_form");
const Add_new_task_btn = document.getElementById("Add_new_task_btn");
const all_subtasks_cont = document.querySelector(".all_subtasks_cont");
const subtask_input_div = document.querySelector(".subtask_input_div");
const subtask_input = document.querySelector(".subtask_input_div > input");
const subtask_input_addBtn = document.querySelector(
    ".subtask_input_div > button"
);
const add_new_subtask_btn = document.querySelector(".add_new_subtask_btn");
const new_task_nameInp = document.querySelector(".new_task_nameInp");
const new_task_descInp = document.querySelector(".new_task_descInp");
const new_task_Status = document.querySelector("#new_task_Status");
const Task_details_popup = document.querySelector(".Task_details_popup");
const Task_details_popup_innerDiv = document.querySelector(
    ".Task_details_popup > div"
);
// const all_todo_task_cont = document.querySelector('.all_todo_task_cont')
// const all_doing_task_cont= document.querySelector('.all_doing_task_cont')
// const all_done_task_cont= document.querySelector('.all_done_task_cont')

Add_new_task_btn.addEventListener("click", remove_task_popup);

subtask_input_addBtn.addEventListener("click", () => {
    if (subtask_input.value) {
        subtasks_to_add.push({ title: subtask_input.value });
        subtask_input.value = "";
        subtask_input_div.style.display = "none";
        show_all_added_subtask();
    } else {
        subtask_input.focus();
    }
});

add_new_subtask_btn.addEventListener("click", () => {
    subtask_input_div.style.display = "flex";
    subtask_input.value = "";
    subtask_input.focus();
});

function set_task_update_details() {
    isTaskUpdateAvailable = true;
    let newstatus = document.getElementById("Task_details_Status");
    current_task.status = newstatus.value;
}

function set_task_details() {
    const todo_html = `<option value="Todo">Todo</option>
                            <option value="Doing">Doing</option>
                            <option value="Done">Done</option>`;

    const doing_html = `<option value="Doing">Doing</option>
                            <option value="Todo">Todo</option>
                            <option value="Done">Done</option>`;

    const done_html = `<option value="Done">Done</option>
                            <option value="Doing">Doing</option>
                            <option value="Todo">Todo</option>`;

    const details = `<div class="Task_details_titleDiv">
                    <h2>
                        <span id="Task_details_title">${current_task.title
        }</span> 
                        <img src="./images/delete-button-svgrepo-com.svg" alt="Delete" onclick="del_task('${current_task._id
        }')"></h2>
                    
                    <h1 onclick="disable_detail_popup()">×</h1>
                </div>
                <div>
                    <p style="font-size:large; color:rgba(30, 35, 58, 0.825)" id="Task_details_description">${current_task.description
        }</p>
                </div>
                <div>
                    <p id="sub_task_counter_popup" >Subtask (${get_total_completed_count()})</p>
                    <div class="Task_details_subtasksDiv">
                        ${current_task.subtasks
            .map((el) => show_subTasks(el))
            .join("")}
                    </div>
                </div>
                <div>
                    <div class="add_form_innerdiv">
                        <p >Current Status</p>
                        <select id="Task_details_Status" onChange="set_task_update_details()">
                            ${current_task.status == "Todo"
            ? todo_html
            : current_task.status == "Doing"
                ? doing_html
                : done_html
        }
                        </select>
                    </div>
                </div>
                <div id='save_changes_btn'> <button onclick="save_changes()">Save Changes</button></div>`;

    Task_details_popup_innerDiv.innerHTML = details;

    let checkboxs = document.querySelectorAll('input[type="checkbox"]');

    for (let box of checkboxs) {
        box.addEventListener("click", (e) => {
            isUpdateAvailable = true;
            let p = document.getElementById(e.target.dataset.id);
            if (e.target.checked) {
                p.setAttribute("style", "text-decoration:line-through");
            } else {
                p.setAttribute("style", "text-decoration:none");
            }
            for (let i in current_task.subtasks) {
                if (current_task.subtasks[i]._id == e.target.dataset.id) {
                    current_task.subtasks[i].isCompleted = e.target.checked;
                }
            }
            document.getElementById(
                "sub_task_counter_popup"
            ).innerText = `Subtask (${get_total_completed_count()})`;
        });
    }
}

function get_total_completed_count() {
    return `${current_task.subtasks.filter((el) => el.isCompleted).length} of ${current_task.subtasks.length
        }`;
}

function show_subTasks(el) {
    return `
            <div  class="subTask_details_cont">
            <input type="checkbox" data-id="${el._id}" ${el.isCompleted ? "checked" : ""
        }>
            <p style="text-decoration: ${el.isCompleted ? "line-through" : "none"
        }; margin-bottom:0" id="${el._id}">${el.title}</p>
        </div>`;
}

function del_task(id) {
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this task!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            fetch(`${url}/boards/${current_board_id}/tasks/${current_task._id}`, {
                method: "DELETE",
                headers: {
                    authorization: `Brearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.isOk) {
                        disable_detail_popup();
                        swal("Task Deleted Successfully", { icon: "success" });
                        get_current_board(current_board_id);
                    } else {
                        swal(data.msg, { icon: "info" });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    swal("Something went wrong!", { icon: "error" });
                });
        }
    });
}

function get_single_task(id) {
    fetch(`${url}/boards/${current_board_id}/tasks/${id}`, {
        headers: {
            authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.isOk) {
                current_task = data.tasks;
                disable_detail_popup();
                set_task_details();
            } else {
                console.log(data);
                swal(data.msg, { icon: "warning" });
            }
        })
        .catch((err) => {
            console.log(err);
            swal("Something went wrong!", { icon: "error" });
        });
}

function add_new_task() {
    
    if (new_task_nameInp.value == "") {
        new_task_nameInp.focus();
        return;
    } else if (new_task_descInp.value == "") {
        new_task_descInp.focus();
        return;
    }

    const task = {
        title: new_task_nameInp.value,
        description: new_task_descInp.value,
        status: new_task_Status.value,
        subtasks: subtasks_to_add,
    };


    fetch(`${url}/boards/${current_board_id}/tasks`, {
        method: "POST",
        headers: {
            authorization: `Bearer ${token}`,
            "Content-type": "application/json",
        },
        body: JSON.stringify(task),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.isOk) {
                reset_add_form();
                get_current_board(current_board_id);
                swal("Task Added Successfully", { icon: "success" });
            } else {
                console.log(data);
                swal(data.msg, { icon: "info" });
            }
        })
        .catch((err) => {
            console.log(err);
            swal("something went wrong!", { icon: "error" });
        });
}

function show_all_added_subtask() {
    let html = subtasks_to_add
        .map((el, i) => {
            return `<div class="subTasks">
                        <h3>${el.title}</h3>
                        <img src="./images/delete-svgrepo-com.svg" alt="delete" class="deleteSubtaskicon" id='${i}'>
                    </div>`;
        })
        .join("");

    all_subtasks_cont.innerHTML = html;

    let subtask_del_btns = document.querySelectorAll(".deleteSubtaskicon");

    for (let btn of subtask_del_btns) {
        btn.addEventListener("click", (e) => {
            let temp = subtasks_to_add.filter((el, i) => i != e.target.id);
            subtasks_to_add = temp
            show_all_added_subtask();
        });
    }
}

function setCounter() {
    todo_count.innerText = counter["todo"];
    doing_count.innerText = counter["doing"];
    done_count.innerText = counter["done"];
}

function showCurentTasks() {
    const { tasks } = current_board;
    let isOk_test;
    let todo_html = [];
    let doing_html = [];
    let done_html = [];

    tasks.forEach((el) => {
        let html = `<div class="task_cont">
                    <h3>${el.title}</h3>
                    <h5 class="task_container_link" id="task_${el._id
            }" onClick="get_single_task('${el._id
            }')"> ${getSubTaskCount(el.subtasks)}</h5>
                </div>`;

        if (el.status == "Todo") {
            isOk_test = true;
            counter["todo"]++;
            todo_html.push(html);
        } else if (el.status == "Doing") {
            isOk_test = true;
            counter["doing"]++;
            doing_html.push(html);
        } else {
            isOk_test = true;
            counter["done"]++;
            done_html.push(html);
        }
    });

    setCounter();

    let html = `<div class="all_todo_task_cont">${todo_html.join("")}</div>
                    <div class="all_doing_task_cont">${doing_html.join(
        ""
    )}</div>
                    <div class="all_done_task_cont">${done_html.join(
        ""
    )}</div>`;

    task_container.innerHTML = !isOk_test? loader_css : html;

    if (!tasks.length) {
        task_container.innerHTML =
            '<p></p><h3 style="text-align: center;width:100%; margin-top:100px;color:rgb(82 82 139 / 58%)">There is no task, please add some...👻</h3><p></p>';
    }
}

function getSubTaskCount(st) {
    return `${st.filter(el => el.isCompleted).length} of ${st.length} subtasks`;
}

function showAddPopup() {
    let boardName;
    swal("Enter Board Name Here....", {
        content: "input",
    }).then((value) => {
        if (value) {
            boardName = value;
            swal({
                title: "Are you sure?",
                text: "Do you want to add new Board with name  '" + value + "' ?",
                icon: "info",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    addBoard(boardName);
                }
            });
        }
    });
}

function addBoard(name) {
    fetch(`${url}/boards`, {
        method: "POST",
        headers: {
            authorization: `Bearer ${token}`,
            "Content-type": "application/json",
        },
        body: JSON.stringify({ name }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.isOk) {
                counter = { todo: 0, doing: 0, done: 0 };
                current_board_count = all_boards_data.length;
                swal("Board Added Successfully!", { icon: "success" });
                getAllBoards();
            }
        })
        .catch((err) => {
            console.log(err);
            swal("Something Went Wrong!", { icon: "info" });
        });
}

function get_current_board(id) {
    setCounter();

    fetch(`${url}/boards/${id}`, {
        headers: {
            authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.isOk) {
                counter = { todo: 0, doing: 0, done: 0 };
                current_board = data.board;
                current_board_name.innerText = current_board.name;
                showCurentTasks();
            } else {
                swal(data.msg, { icon: "info" });
            }
        })
        .catch((err) => {
            console.log(err);
            swal("Something went wrong!", { icon: "error" });
        });
}

function setBoardButtons() {
    board_count.innerText = all_boards_data.length; // setting board count

    let html = all_boards_data
        .map((el, i) => {
            if (el._id == current_board_id) {
                return `<div class="boardName" id="${el._id
                    }" style="color: white;background-color:rgb(99 95 199) ;border:1px solid rgb(99 95 199)">  Board ${i + 1
                    } </div>`;
            } else {
                return `<div class="boardName" id="${el._id}">Board ${i + 1} </div>`;
            }
        })
        .join("");
    all_boards.innerHTML = html;

    const all_boards_ = document.querySelectorAll(".boardName");

    Array.from(all_boards_).forEach((board, index) => {
        board.addEventListener("click", (e) => {
            if (e.target.id != current_board_id) {
                current_board_id = e.target.id;
                task_container.innerHTML = loader_css;
                counter = { todo: 0, doing: 0, done: 0 };
                setCounter();
                setBoardButtons();
                get_current_board(e.target.id);
                current_board_count = index;
            }
        });
    });
}

function getAllBoards() {
    task_container.innerHTML = loader_css;

    fetch(`${url}/boards`, {
        headers: {
            authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.isOk) {
                all_boards_data = data.boards;
                current_board_id = data.boards[current_board_count]._id;
                setBoardButtons();
                get_current_board(data.boards[current_board_count]._id);
            } else {
                swal(data.msg, { icon: "info" });
            }
        })
        .catch((err) => {
            console.log(err);
            swal("Somewent worng!", { icon: "error" });
        });
}

function verify() {
    if (!token || token == "") {
        swal("Login Required", { icon: "info" }).then(() => {
            window.location.href = "./login/logReg.html";
        });
        return;
    }

    document.getElementById("delay_loader").style.display = "flex";

    fetch(`${url}/user/verify`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ token: localStorage.getItem("token") }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.isexpired) {
                swal("Page Expired!", { icon: "warning" }).then((res) => {
                    window.location.href = "./login/logReg.html";
                });
            } else {
                document.getElementById("delay_loader").style.display = "none";
                getAllBoards();
            }
        });
}

function delete_Board() {
    let x = all_boards_data.length
    if(x == 1){
        swal({
            title :"Unable to delete",
            text:"Atleast one board must be present in inventory!",
            icon:"warning"
        }).then(()=>{
            return
        })
    }
    else{
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this Board!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            fetch(`${url}/boards/${current_board._id}`, {
                method: "DELETE",
                headers: {
                    authorization: `bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.isOk) {
                        swal("Board Deleted Successfully", { icon: "success" });
                        if (current_board_count == all_boards_data.length - 1) {
                            current_board_count = 0;
                        }
                        getAllBoards();
                    }
                })
                .catch((err) => {
                    console.log(err);
                    swal("Something went wrong!", { icon: "warning" });
                });
        }
    });
}
}

function remove_task_popup() {
    if (Add_task_form.style.display == "flex") {
        Add_task_form.style.display = "none";
    } else {
        Add_task_form.style.display = "flex";
    }
}

function reset_add_form() {
    document.querySelector(".Add_task_form > div").style.zIndex = 1;

    remove_task_popup();
    all_subtasks_cont.innerHTML = "";
    subtasks_to_add = [];
    new_task_nameInp.value = "";
    new_task_descInp.value = "";
    new_task_Status.innerHTML = `<option value="Todo">Todo</option>
                    <option value="Doing">Doing</option>
                    <option value="Done">Done</option>`;
}

function disable_detail_popup() {
    if (Task_details_popup.style.display == "flex") {
        Task_details_popup.style.display = "none";
    } else Task_details_popup.style.display = "flex";
}

function save_changes() {
    show_loader();
    if (isTaskUpdateAvailable || isUpdateAvailable) {
        update_single_task();
    }
}

function show_loader() {
    document.getElementById("delay_loader").style.display = "flex";
    let x = setInterval(() => {
        if (!isTaskUpdateAvailable) {
            document.getElementById("delay_loader").style.display = "none";
            swal("Saved Changes Successfully", { icon: "success" });
            disable_detail_popup();
            clearInterval(x);
        }
    }, 1000);
}

// function update_subtasks() {
//     fetch(
//         `${url}/boards/${current_board_id}/tasks/${current_task._id}/subtasks`,
//         {
//             method: "PUT",
//             headers: {
//                 "Content-type": "application/json",
//                 authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({ subtasks: current_task.subtasks }),
//         }
//     )
//         .then((res) => res.json())
//         .then((data) => {
//             if (data.isOk) {
//                 counter = { todo: 0, doing: 0, done: 0 };
//                 get_current_board(current_board_id);
//                 isUpdateAvailable = null;
//             } else {
//                 console.log(data);
//                 swal(data.msg, { icon: "info" });
//             }
//         })
//         .catch((err) => {
//             console.log(err);
//             swal("Something went wrong!", { icon: "error" });
//         });
// }

function update_single_task() {
    let task = {
        title: current_task.title,
        description: current_task.description,
        status: current_task.status,
        subtasks : current_task.subtasks
    };
    console.log(task)

    fetch(`${url}/boards/${current_board_id}/tasks/${current_task._id}`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.isOk) {
                console.log(data)
                counter = { todo: 0, doing: 0, done: 0 };
                get_current_board(current_board_id);
                isTaskUpdateAvailable = null;
            } else {
                swal(data.msg, { icon: "info" });
            }
        })
        .catch((err) => {
            console.log(err);
            swal("Something went wrong!", { icon: "error" });
        });
}

window.addEventListener("onload", verify());
