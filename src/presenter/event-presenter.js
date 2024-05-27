import { render, replace, remove } from '../framework/render';
import EventEditorView from '../view/event-editor-view';
import EventView from '../view/event-view';
import {UserActions, UpdateTypes, PRESENTER_MODES } from '../const';
import { isEscKey } from '../utils';

export default class EventPresenter {

  #eventComponent;
  #editorComponent;
  #event;

  #eventsContainer;
  #onEventChange;
  #onModeChange;
  #mode = PRESENTER_MODES.DEFAULT;
  #offers;
  #destinations;

  constructor({offers, destinations, eventsContainer, onEventChange, onModeChange}){
    this.#eventsContainer = eventsContainer;
    this.#onEventChange = onEventChange;
    this.#onModeChange = onModeChange;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  #onDocumentKeyDown = (evt) => {
    if (isEscKey(evt.key)) {
      evt.preventDefault();
      this.#editorComponent.reset(this.#event);
      this.#replaceEditorToEvent();
      document.removeEventListener('keydown', this.#onDocumentKeyDown);
    }
  };

  init(event) {
    const prevEvent = this.#eventComponent;
    const prevEdit = this.#editorComponent;
    const curTypeOffers = this.#offers[event.type];
    const curTypeDestination = this.#destinations.find(({ id }) => id === event.destination);

    this.#event = {
      ...event,
    };

    this.#eventComponent = new EventView(
      {
        event: this.#event,
        offers: curTypeOffers,
        destinations: curTypeDestination,
        onEventClick: () => {
          this.#replaceEventToEditor();
          document.addEventListener('keydown', this.#onDocumentKeyDown);
        },
        onFavoriteClick: this.#onFavoriteClick,
        onSubmit: this.#onFormSubmit
      }
    );

    this.#editorComponent = new EventEditorView(
      {
        offers: this.#offers,
        destinations: this.#destinations,
        event: this.#event,
        onSubmit: this.#onFormSubmit,
        deleteEvent: this.#onDeleteEvent
      },
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
    document.addEventListener('keydown', this.#onDocumentKeyDown);
    this.#onModeChange();
    this.#mode = PRESENTER_MODES.EDITING;
  }

  #replaceEditorToEvent () {
    replace(this.#eventComponent, this.#editorComponent);
    document.addEventListener('keydown', this.#onDocumentKeyDown);
    this.#mode = PRESENTER_MODES.DEFAULT;
  }

  #onFavoriteClick = ( ) => {
    this.#onEventChange(
      UserActions.UPDATE_EVENT,
      UpdateTypes.MINOR,
      {...this.#event, isFavorite: !this.#event.isFavorite},
    );
  };

  #onFormSubmit = (update) => {
    if(update === undefined){
      this.#editorComponent.reset(this.#event);
      this.#replaceEditorToEvent();
      return;
    }
    const isMajor = () =>
      update.basePrice !== this.#event.basePrice ||
        update.date.start !== this.#event.date.start ||
        update.type !== this.#event.type;

    this.#onEventChange(
      UserActions.UPDATE_EVENT,
      isMajor() ? UpdateTypes.MAJOR : UpdateTypes.MINOR,
      update
    );
  };

  #onDeleteEvent = (event) =>{
    this.#onEventChange(
      UserActions.DELETE_EVENT,
      UpdateTypes.MAJOR,
      event,
    );
  };
}
