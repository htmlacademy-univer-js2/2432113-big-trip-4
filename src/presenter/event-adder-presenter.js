import {remove, render, RenderPosition} from '../framework/render.js';
import EventEditorView from '../view/event-editor-view.js';
import {UserActions, UpdateTypes} from '../const.js';
import { isEscKey } from '../utils.js';
import { blankEvenStruct } from '../const.js';

export default class EventAdderPresenter {
  #eventsContainer = null;
  #onDataChange = null;
  #onDestroy = null;
  #allOffers;
  #allDestinations;

  #editorComponent = null;

  constructor({eventsContainer, onDataChange, onDestroy, offers, destinations}) {
    this.#eventsContainer = eventsContainer;
    this.#onDataChange = onDataChange;
    this.#onDestroy = onDestroy;
    this.#allOffers = offers;
    this.#allDestinations = destinations;
  }

  init() {
    if (this.#editorComponent !== null) {
      return;
    }

    this.#editorComponent = new EventEditorView({
      //теперь destination не null и выбран заранее из полученного с сервера списка
      event: {...blankEvenStruct,
        destination: this.#allDestinations[0].id
      },
      onSubmit: this.#handleFormSubmit,
      deleteEvent: this.#handleDeleteClick,
      offers: this.#allOffers,
      destinations: this.#allDestinations,
      isNew: true
    });

    render(this.#editorComponent, this.#eventsContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (!this.#editorComponent) {
      return;
    }

    this.#onDestroy();

    remove(this.#editorComponent);
    this.#editorComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#editorComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#editorComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editorComponent.shake(resetFormState);
  }

  #handleFormSubmit = (event) => {
    this.#onDataChange(
      UserActions.ADD_EVENT,
      UpdateTypes.MINOR,
      {...event, isFavorite: false},
    );
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
