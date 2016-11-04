import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

const TodoMaker = (props) => {
  const onKeyPress = e => {
    if(e.key == 'Enter'){
      props.onAddTodo({text: e.target.value, done: false, id: new Date().toISOString()});
      e.target.value = '';
    }
  }

  return (
    <section className='todoapp'>
      <header className="header">
        <h1>{props.title}</h1>
        <input className='new-todo' onKeyPress={onKeyPress} placeholder={props.message} type={'text'}/>
      </header>
    </section>
  );
}

class Label extends Component {
  constructor(...args){
    super(...args);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.state = {
      editing: false
    }
  }

  handleKeyPressed (id, e) {
    if (e.key == 'Enter') {
      this.props.onEdit({ text: e.target.value, id: id });
      e.target.value = '';
      this.setState({ editing: false });
    }
  }

  handleDoubleClick(){
    this.setState({
      editing: true
    })
  }

  handleChange (id, e) {
    this.props.onEdit({ text: e.target.value, id: id})
  }

  render(){
    const { id, text } = this.props

    return this.state.editing
      ? <input
          autoFocus
          className='new-todo'
          onKeyPress={this.handleKeyPressed.bind(this, id)}
          value={this.props.text}
          onChange={this.handleChange.bind(this, id)}/>
      : <label
          onDoubleClick={this.handleDoubleClick}>{this.props.text}</label>
  }
}

class Todo extends Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
  };

  handleChange () {
    this.props.onDone(this.props.id);
  }

  handleRemove () {
    this.props.onRemoveTodo(this.props.id);
  }

  render(){
    const { id, done, text, onEditTodo } = this.props
    return (
      <div className="view">
        <input
          id={id}
          onChange={this.handleChange}
          checked={done}
          className="toggle"
          type="checkbox"/>
        <Label id={id} text={text} onEdit={onEditTodo}/>
        <button onClick={this.handleRemove} className="destroy"></button>
      </div>
    );
  }
}

const TodoList = (props) => {
  const todos = props.todos.map((todo, index) => {
    const completed = cx({'completed': todo.done })
    return (
      <li key={index} className={completed}>
        <Todo {...props}
          id={todo.id}
          done={todo.done}
          text={todo.text}
          onRemoveTodo={props.onRemoveTodo}
          onEditTodo={props.onEditTodo} />
      </li>
    );
  });

  return (
    <ul className="todo-list">
      {todos}
    </ul>
  )
}

class TodoFooter extends Component {
  constructor(props){
    super(props)
    this.state = {
      activeFilter: {
        'all': false,
        'active': false,
        'completed': false
      }
    }
    this.handleClickAll = this.handleClickAll.bind(this)
  }

  handleClickAll () {
    this.setState({activeFilter: {'all': true}})
  }

  render (){
    const { itemsLeft } = this.props;
    const filterClass = cx({
      'selected': this.state.activeFilter.all,
      'selected': this.state.activeFilter.active,
      'selected': this.state.activeFilter.completed
    })

    return(
      <footer className='footer'>
      <span className='todo-count'>{itemsLeft} items left</span>
        <ul className='filters'>
          <li><a href='#' onClick={this.handleClickAll} className={filterClass}>All</a></li>
          <li><a href='#' onClick={this.handleClick} className={filterClass}>Active</a></li>
          <li><a href='#' onClick={this.handleClick} className={filterClass}>Completed</a></li>
        </ul>
      </footer>
    )
  }
}

class TodoApp extends Component {
  constructor(props){
    super(props)
    this.addTodo = this.addTodo.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.removeTodo = this.removeTodo.bind(this)
    this.editTodo = this.editTodo.bind(this)
    this.state = {
      todos: []
    }
  }

  componentDidMount(){
    let initialState = JSON.parse(localStorage.getItem('MyTodoAppState'));
    if (!initialState) {
      initialState = {};
    };
    this.setState(initialState);
  }

  updateState(newState){
    localStorage.setItem('MyTodoAppState', JSON.stringify(newState));
    this.setState(newState)
  }

  handleChange (id) {
    const newState = this.state.todos.map(todo => {
      if (todo.id == id){
        return {...todo, done: !todo.done}
      }

      return todo
    });

    this.updateState({
      todos: newState
    })
  }

  addTodo (todo) {
    var currentTodos = this.state.todos;
    currentTodos.push(todo);
    var newState = {todos: currentTodos}

    this.updateState(newState);
  }

  removeTodo (id) {
    var newState = this.state.todos.filter(todo => todo.id !== id)
    this.updateState({ todos: newState });
  }

  editTodo ({ id, text }) {
    var newState = this.state.todos.map( todo => {
      if(id !== todo.id){
        return todo
      } else {
        return { ...todo, text: text }
      }
    });

    this.updateState({ todos: newState });
  }

  render () {
    const itemsLeft = this.state.todos.lenght
    return (
      <div className="todoapp">
        <TodoMaker {...this.props} onAddTodo={this.addTodo}/>
        <TodoList
          todos={this.state.todos}
          onDone={this.handleChange}
          onRemoveTodo={this.removeTodo}
          onEditTodo={this.editTodo} />
        <TodoFooter itemsLeft={itemsLeft} />
      </div>
    )
  }
}

ReactDOM.render(
  <TodoApp title='ToDo ReactJS' message='What needs to be done'/>,
  document.getElementById('app')
);
