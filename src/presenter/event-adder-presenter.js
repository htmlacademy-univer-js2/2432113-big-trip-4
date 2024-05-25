import {remove, render} from '../framework/render.js';
import EventEditorView from '../view/event-editor-view.js';
import {nanoid} from 'nanoid';
import {UserActions, UpdateTypes} from '../const.js';
import { isEscKey } from '../utils.js';
import { BLANK_EVENT_STRUCT } from '../const.js';

export default class EventAdderPresenter {
  #eventsContainer = null;
  #onDataChange = null;
  #onDestroy = null;

  #editorComponent = null;

  constructor({eventsContainer, onDataChange, onDestroy}) {
    this.#eventsContainer = eventsContainer;
    this.#onDataChange = onDataChange;
    this.#onDestroy = onDestroy;
  }

  init() {
    if (this.#editorComponent !== null) {
      return;
    }

    this.#editorComponent = new EventEditorView({
      event: BLANK_EVENT_STRUCT,
      onSubmit: this.#handleFormSubmit,
      deleteEvent: this.#handleDeleteClick
    });

    render(this.#editorComponent, this.#eventsContainer);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#editorComponent === null) {
      return;
    }

    this.#onDestroy();

    remove(this.#editorComponent);
    this.#editorComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (event) => {
    if(event === undefined){
      return;
    }
    this.#onDataChange(
      UserActions.ADD_EVENT,
      UpdateTypes.MINOR,
      {id: nanoid(), ...event},
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (isEscKey(evt.key)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
