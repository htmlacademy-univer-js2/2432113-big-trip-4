import { remove, render, replace } from '../framework/render';
import TripInfoModel from '../model/trip-info-model';
import TripInfoView from '../view/trip-info-view';

export default class TripInfoPresenter{
  #tripInfoComponent;
  #offersModel;
  #destinationsModel;
  #tripMain;
  #model = null;

  constructor({tripMain, offersModel, destinationsModel}){
    this.#tripMain = tripMain;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

  }


  init(events){
    const prevTripInfoComponent = this.#tripInfoComponent;

    this.#model = new TripInfoModel({
      events: events,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
    });

    this.#tripInfoComponent = new TripInfoView(this.#model.info);

    if (!prevTripInfoComponent) {

      render(this.#tripInfoComponent, this.#tripMain);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  destroy = () => {
    remove(this.#tripInfoComponent);
  };
}
