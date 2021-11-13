import React, { useState, FormEvent, ChangeEvent } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import AsyncSelect from "react-select/async";
import { useHistory } from "react-router-dom";

import Orphanage from '../utils/orphanageCreate';
import initialPosition from '../utils/positionInitial';
import { fetchLocalMapBox } from '../services/apiMapBox';

import Sidebar from "../components/Sidebar";

import { FiPlus } from "react-icons/fi";
import mapMarkerImg from "../images/map-marker.svg";
import mapIcon from "../utils/mapIcon";

import "../styles/pages/create-orphanage.css";

import { v4 as uuidv4 } from "uuid";

import api from '../services/api';

export default function CreateOrphanage() {
  const history = useHistory();
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

  const [position, setPosition] = useState({ latitude: null, longitude: null });

  const [name, setName] = useState("");
  const [address, setAddress] = useState<{

} | null>(null);

const [about, setAbout] = useState("");
const [whatsapp, setWhatsapp] = useState("");
const [instructions, setInstructions] = useState("");
const [opening_hours, setOpeningHours] = useState("");
const [open_on_weekends, setOpenOnWeekends] = useState(true);
const [images, setImages] = useState<File[]>([]);
const [previewImages, setPreviewImages] = useState<string[]>([]);

const [location, setLocation] = useState(initialPosition);

const loadOptions = async (inputValue: any, callback: any) => {
  const response = await fetchLocalMapBox(inputValue);
  let places: any = [];
  if (inputValue.length < 5) return;
  response.features.map((item: any) => {
    places.push({
      label: item.place_name,
      value: item.place_name,
      coords: item.center,
      place: item.place_name,
    });
  });
  callback(places);
};

const handleChangeSelect = (event: any) => {
  setPosition({
    longitude: event.coords[0],
    latitude: event.coords[1],
  });

  setAddress({ label: event.place, value: event.place });

  setLocation({
    lng: event.coords[0],
    lat: event.coords[1],
  });
};

function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
  if(!event.target.files) {
  return;
  }

  const selectedImages = Array.from(event.target.files);

  setImages(selectedImages);

  const selectedImagesPreview = selectedImages.map(image => {
    return URL.createObjectURL(image);
  });

  setPreviewImages(selectedImagesPreview);
}

async function handleSubmit(event: FormEvent) {
  event.preventDefault();

  const {latitude, longitude} = position;

  const data = new FormData();

  data.append('name', name);
  data.append('about', about);
  data.append('whatsapp', whatsapp);
  data.append('address', String(address));
  data.append('latitude', String(latitude));
  data.append('longitude', String(longitude));
  data.append('instructions', instructions);
  data.append('opening_hours', opening_hours);
  data.append('open_on_weekends', String(open_on_weekends));

    images.forEach(image => {
      data.append('images', image);
    })

  await api.post('orphanages', data);

  alert('Cadastro realizado com sucesso');

  history.push('/app');
}

  return (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form className="create-orphanage-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados</legend>

              <div className="input-block">
              <label htmlFor="address">Endereço</label>
              <AsyncSelect
                className="address-select"
                placeholder="Digite seu endereço..."
                classNamePrefix="filter"
                cacheOptions
                loadOptions={loadOptions}
                onChange={handleChangeSelect}
                value={address}
              />
            </div>


            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input
              id="name"
              onChange={event => setName(event.target.value)}
              value={name} />
            </div>

            <div className="input-block">
              <label htmlFor="about">
                Sobre <span>Máximo de 300 caracteres</span>
              </label>
              <textarea
              id="name" maxLength={300}
              onChange={event => setAbout(event.target.value)}
              value={about} />
            </div>

            <div className="input-block">
              <label htmlFor="about">
                Whatsapp <span>Adicione o DD e o número</span>
              </label>
              <input
              id="name"
              placeholder="Exemplo: (11)99750.4302"
              onChange={event => setWhatsapp(event.target.value)}
              value={whatsapp} />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos (Para adicionar + imagens selecione todas de uma vez)</label>

              <div className="images-container">
              {previewImages.map(image => {
                return (
                  <img key={image} src={image} alt={name} />
                )
              })}

              <label htmlFor="image[]" className="new-image">
                <FiPlus size={24} color="#15b6d6" />
              </label>

              </div>
              <input multiple onChange={handleSelectImages} type ="file" id="image[]" />

            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea
              id="instructions"
              onChange={event => setInstructions(event.target.value)}
              value={instructions} />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input
              id="opening_hours"
              onChange={event => setOpeningHours(event.target.value)}
              value={opening_hours} />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                type="button"
                className={open_on_weekends ? 'active' : ''}
                onClick={() => setOpenOnWeekends(true)}
                >
                  Sim
                </button>
                <button
                type="button"
                className={!open_on_weekends ? 'active' : ''}
                onClick={() => setOpenOnWeekends(false)}
                >Não</button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}
