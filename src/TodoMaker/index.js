import React, { PropTypes } from 'react'

const TodoMaker = (props) => {
  const onKeyPress = e => {
    if (e.key === 'Enter') {
      props.onAddTodo({
        text: e.target.value,
        done: false,
        id: new Date().toISOString()
      })
      e.target.value = ''
    }
  }

  return (
    <section className='todoapp'>
      <header className='header'>
        <h1>{props.title}</h1>
        <input
          className='new-todo'
          onKeyPress={onKeyPress}
          placeholder={props.message}
          type={'text'} />
      </header>
    </section>
  )
}

TodoMaker.propTypes = {
  title: PropTypes.string,
  onAddTodo: PropTypes.func,
  message: PropTypes.string
}

export default TodoMaker
