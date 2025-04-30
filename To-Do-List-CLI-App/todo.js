const fs = require('fs');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

// Load tasks from JSON file
const loadTasks = () => {
    try {
        const data = fs.readFileSync('tasks.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Save tasks to JSON file
const saveTasks = (tasks) => {
    fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
};

// Add a new task
if (argv.add) {
    const tasks = loadTasks();
    tasks.push({ id: Date.now(), task: argv.add, completed: false });
    saveTasks(tasks);
    console.log('Task added successfully!');
}

if (argv.list) {
    const tasks = loadTasks();
    console.log('Your Tasks:');
    tasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.task} [${task.completed ? '✓' : ' '}]`);
    });
}

// Mark a task as completed
if (argv.complete) {
    const taskId = parseInt(argv.complete);
    const tasks = loadTasks();
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
        task.completed = true;
        saveTasks(tasks);
        console.log(`Task "${task.task}" marked as complete!`);
    } else {
        console.log('Task not found!');
    }
}

// Delete a task
if (argv.delete) {
    const taskId = parseInt(argv.delete);
    let tasks = loadTasks();
    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex !== -1) {
        const deletedTask = tasks.splice(taskIndex, 1);
        saveTasks(tasks);
        console.log(`Deleted task: "${deletedTask[0].task}"`);
    } else {
        console.log('Task not found!');
    }
}

const colors = require('colors');
 // Modify list output
 console.log('Your Tasks:'.green.bold);
 tasks.forEach((task, ) => {
    const status = task.completed ? '✓'.green : '✗'.red;
    console.log(`${task.id} | ${task.task} [${status}]`);
 });