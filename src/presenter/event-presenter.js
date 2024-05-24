import { render, replace, remove } from '../framework/render';
import EventEditorView from '../view/event-editor-view';
import EventView from '../view/event-view';
import { PRESENTER_MODES } from '../const';

export default class EventPresenter {

  #eventComponent;
  #editorComponent;
  #event;

  #eventsContainer;
  #onEventChange;
  #onModeChange;
  #mode = PRESENTER_MODES.DEFAULT;

  constructor({eventsContainer, onEventChange, onModeChange}){
    this.#eventsContainer = eventsContainer;
    this.#onEventChange = onEventChange;
    this.#onModeChange = onModeChange;
  }

  #onDocumentKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditorToEvent();
      document.removeEventListener('keydown', this.#onDocumentKeyDown);
    }
  };

  init(event) {
    const prevEvent = this.#eventComponent;
    const prevEdit = this.#editorComponent;
    this.#event = event;
    this.#eventComponent = new EventView(
      {
        event: this.#event,
        onEventClick: () => {
          this.#replaceEventToEditor();
          document.addEventListener('keydown', this.#onDocumentKeyDown);
        },
        onFavoriteClick: this.#onFavoriteClick,
      }
    );

    this.#editorComponent = new EventEditorView(
      {
        event: this.#event,
        onEventClick: () =>{
          this.#replaceEditorToEvent();
          document.removeEventListener('keydown', this.#onDocumentKeyDown);
        }
      }
    );

    if(prevEvent === undefined || prevEdit === undefined){
      render(this.#eventComponent, this.#eventsContainer);
      return;
    }

    if(this.#mode === PRESENTER_MODES.DEFAULT){
      replace(this.#eventComponent, prevEvent);
    }

    if(this.#mode === PRESENTER_MODES.EDITING){
      replace(this.#editorComponent, prevEdit);
    }

    remove(prevEvent);
    remove(prevEdit);
  }

  resetView(){
    if (this.#mode !== PRESENTER_MODES.DEFAULT){
      this.#replaceEditorToEvent();
    }
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#editorComponent);
  }

  #replaceEventToEditor () {
    replace(this.#editorComponent, this.#eventComponent);
    this.#onModeChange();
    this.#mode = PRESENTER_MODES.EDITING;
  }

  #replaceEditorToEvent () {
    replace(this.#eventComponent, this.#editorComponent);
    this.#mode = PRESENTER_MODES.DEFAULT;
  }

  #onFavoriteClick = ( ) => {
    this.#onEventChange({...this.#event, isFavorite: !this.#event.isFavorite});
  };
}
