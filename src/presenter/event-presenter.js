import { render, replace, remove } from '../framework/render';
import EventEditorView from '../view/event-editor-view';
import EventView from '../view/event-view';
import {UserActions, UpdateTypes, PresenterModes } from '../const';
import { isEscKey } from '../utils';

export default class EventPresenter {

  #eventComponent;
  #editorComponent;
  #event;

  #eventsContainer;
  #onEventChange;
  #onModeChange;
  #mode = PresenterModes.DEFAULT;
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
        deleteEvent: this.#onDeleteEvent,
        isNew: false
      },
    );

    if(prevEvent === undefined || prevEdit === undefined){
      render(this.#eventComponent, this.#eventsContainer);
      return;
    }

    if(this.#mode === PresenterModes.DEFAULT){
      replace(this.#eventComponent, prevEvent);
    }

    if(this.#mode === PresenterModes.EDITING){
      replace(this.#editorComponent, prevEdit);
    }

    remove(prevEvent);
    remove(prevEdit);
  }

  setSaving() {
    if (this.#mode === PresenterModes.EDITING) {
      this.#editorComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === PresenterModes.EDITING) {
      this.#editorComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === PresenterModes.DEFAULT) {
      this.#eventComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#editorComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editorComponent.shake(resetFormState);
  }

  resetView(){
    if (this.#mode !== PresenterModes.DEFAULT){
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
    this.#mode = PresenterModes.EDITING;
  }

  #replaceEditorToEvent () {
    replace(this.#eventComponent, this.#editorComponent);
    document.addEventListener('keydown', this.#onDocumentKeyDown);
    this.#mode = PresenterModes.DEFAULT;
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
