/*
 * Editor based on Draft
 */

import React from 'react'
import T from 'prop-types'
import R from 'ramda'
import PubSub from 'pubsub-js'

import { EditorState, ContentState, Modifier } from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import createMentionPlugin from 'draft-js-mention-plugin'
// import createLinkifyPlugin from 'draft-js-linkify-plugin'

import { EVENT } from '@constant'
import { buildLog } from '@utils'

import toRawString from './exportContent'
import { Wrapper } from './styles/body_editor'

/*
   const linkifyPlugin = createLinkifyPlugin({
   theme: { link: 'typewriter-link' },
   })
 */

const mentionThemeClass = {
  mention: 'typewriter-mention',
  mentionSuggestions: 'typewriter-suggestions',
  mentionSuggestionsEntry: 'typewriter-mentionSuggestionsEntry',
  mentionSuggestionsEntryFocused: 'typewriter-mentionSuggestionsEntryFocused',
  mentionSuggestionsEntryAvatar: 'typewriter-mentionSuggestionsEntryAvatar',
  mentionSuggestionsEntryText: 'typewriter-mentionSuggestionsEntryText',
}

/* eslint-disable no-unused-vars */
const log = buildLog('C:BodyEditor')
/* eslint-enable no-unused-vars */

const mentionFilter = (value, mentions) =>
  R.filter(m => R.startsWith(value, R.toLower(m.name)), mentions)

class BodyEditor extends React.Component {
  constructor(props) {
    super(props)

    this.mentionPlugin = createMentionPlugin({
      theme: mentionThemeClass,
      mentionPrefix: '@',
    })
    this.initPubSub()
  }

  state = {
    editorState: EditorState.createEmpty(),
    suggestions: [],
    mentionList: [],
    pub: null,
  }

  componentDidMount() {
    this.loadDraft()
    this.loadUserSuggestions()
  }

  componentWillReceiveProps(nextProps) {
    /* eslint-disable react/destructuring-assignment */
    if (
      nextProps.mentionList &&
      !R.equals(nextProps.mentionList, this.state.mentionList)
    ) {
      this.loadUserSuggestions(nextProps.mentionList)
    }
    /* eslint-enable react/destructuring-assignment */
  }

  componentWillUnmount() {
    const { pub } = this.state
    PubSub.unsubscribe(pub)
    this.clearContent()
  }

  initPubSub() {
    const pub = PubSub.subscribe(EVENT.DRAFT_INSERT_SNIPPET, (event, data) => {
      this.insertSnippet(data.data)
    })
    this.setState({ pub })
  }

  loadDraft = () => {
    const { body } = this.props

    // see: https://stackoverflow.com/questions/35884112/draftjs-how-to-initiate-an-editor-with-content
    const editorState = EditorState.createWithContent(
      ContentState.createFromText(body)
    )

    this.setState({ editorState }, () => {
      this.editor.componentWillMount()
    })
  }

  insertSnippet = data => {
    const { editorState } = this.state
    /* const contentState = ContentState.createFromText('ni ma') */
    const contentState = editorState.getCurrentContent()
    const selection = editorState.getSelection()
    const nextContentState = Modifier.insertText(
      contentState,
      selection,
      `\n${data}\n`
    )

    const nextEditorState = EditorState.push(editorState, nextContentState)
    this.setState({ editorState: nextEditorState }, () => {
      this.focus()
    })
  }

  onBlur = () => {}

  onChange = editorState => {
    const { onChange } = this.props
    // const oldString = toRawString(this.state.editorState.getCurrentContent())
    const newString = toRawString(editorState.getCurrentContent())
    // console.log('onChange raw: ', newString)

    onChange(newString)
    this.setState({ editorState })
  }

  onSearchChange = ({ value }) => {
    /* console.log('onSearchChange value: ', value) */
    const { onMentionSearch } = this.props
    onMentionSearch(value)

    this.setState(prevState => ({
      suggestions: mentionFilter(value, prevState.mentionList),
    }))
  }

  loadUserSuggestions = propsMentionList => {
    /* eslint-disable react/destructuring-assignment */
    const mentionList = propsMentionList || this.props.mentionList
    // log('loadUserSuggestions --->', mentionList)
    this.setState({ suggestions: mentionList, mentionList })
    /* eslint-enable react/destructuring-assignment */
  }

  onAddMention = user => {
    const { onMention } = this.props
    onMention(user)
    // get the mention object selected
  }

  focus = () => {
    if (this.editor) {
      this.editor.focus()
    }
  }

  clearContent = () => {
    const editorState = EditorState.createWithContent(
      ContentState.createFromText('')
    )
    this.setState({ editorState })
  }

  render() {
    const { MentionSuggestions } = this.mentionPlugin
    const plugins = [this.mentionPlugin]
    const { editorState, suggestions } = this.state

    /* console.log('mentionList-> ', this.props.mentionList) */
    //  console.log('suggestions : ', suggestions)

    return (
      <Wrapper onClick={this.focus}>
        <Editor
          editorState={editorState}
          onChange={this.onChange}
          onBlur={this.onBlur}
          plugins={plugins}
          ref={element => {
            this.editor = element
          }}
        />
        <MentionSuggestions
          onSearchChange={this.onSearchChange}
          suggestions={suggestions}
          onAddMention={this.onAddMention}
        />
      </Wrapper>
    )
  }
}

BodyEditor.propTypes = {
  mentionList: T.arrayOf(
    T.shape({
      id: T.string,
      avatar: T.string,
      name: T.string,
    })
  ),
  body: T.string,
  onMentionSearch: T.func,
  onMention: T.func,
  onChange: T.func,
}

BodyEditor.defaultProps = {
  body: '',
  mentionList: [],
  onMention: log,
  onMentionSearch: log,
  onChange: log,
}

export default BodyEditor
