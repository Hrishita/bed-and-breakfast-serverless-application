/*Author : Parthkumar Patel (B00899800)*/
import axios from "axios";
import Constants from './constants';
const API = axios.create({ baseURL: Constants.AXIOS_HOTEL });
const roompub = axios.create({ baseURL: 'https://us-central1-csci5410-group23.cloudfunctions.net/' });
const invoicepub = axios.create({ baseURL: 'https://us-central1-csci5410-group23.cloudfunctions.net/' });


export const addFacility = (FacilityData) => API.post("/facility", FacilityData);
export const getFacilities = () => API.get(`/facilities`);
export const updateFacilityById = (FacilityData) =>  API.patch(`/facility`, FacilityData);
export const deleteFacilityById = (FacilityId) => API.delete(`/facility?FacilityId=${FacilityId}`);

export const addRoomType = (RoomTypeData) => API.post("/roomtype", RoomTypeData);
export const getRoomTypes = () => API.get(`/roomtypes`);
export const updateRoomTypeById = (RoomTypeData) =>  API.patch(`/roomtype`, RoomTypeData);
export const deleteRoomTypeById = (RoomTypeId) => API.delete(`/roomtype?RoomTypeId=${RoomTypeId}`);

export const addRoom = (RoomData) => API.post("/room", RoomData);
export const getRooms = () => API.get(`/rooms`);
export const updateRoomById = (RoomData) =>  API.post(`/room`, RoomData);
export const updateRoomFieldById = (RoomData) =>  API.patch(`/room`, RoomData);
export const deleteRoomById = (RoomId) => API.delete(`/room?RoomId=${RoomId}`);

export const addReservation = (ReservationData) => API.post("/reservation", ReservationData);
export const getReservations = () => API.get(`/reservations`);
export const updateReservationFieldById = (ReservationData) =>  API.patch(`/reservation`, ReservationData);
export const deleteReservationById = (ReservationId) => API.delete(`/reservation?ReservationId=${ReservationId}`);

export const getFoodItems = () => API.get(`/fooditems`);
export const getFoodOders = () => API.get(`/foodorders`);
export const getCust = () => API.get(`/custid`);

export const addFoodOder = (FoodOderData) => API.post("/foodorder", FoodOderData);
export const deleteFoodOderById = (FoodOderId) => API.delete(`/foodorder?orderId=${FoodOderId}`);
export const postRoomPub = (PostData) => roompub.post("/place-order-publisher", PostData);
export const postInvoicePub = (PostData) => invoicepub.post("/invoice_gen", PostData);

export const getLogs = () => API.get(`/logs`);
export const addLog = (LogData) => API.post("/log", LogData);