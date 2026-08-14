import { Router } from 'express';
import {  createShipment,
  getMyShipments,
  getShipmentById,
  updateShipment,
  deleteShipment,
  markShipmentOptimized,
  shipmentMetrics} from "../controllers/shipment.controller.js";

import { verifyJWT } from '../middlewares/auth.middlewares.js';



const router = Router();





// Support POST to the collection root for compatibility with frontend
router.route('/').post(verifyJWT, createShipment);
router.route('/my-shipments').get(verifyJWT, getMyShipments);
router.route('/shipment/:shipmentId').get(verifyJWT, getShipmentById);
router.route('/shipment/:shipmentId').put(verifyJWT, updateShipment);
router.route('/shipment/:shipmentId').delete(verifyJWT, deleteShipment);
router.route('/shipment/:shipmentId/optimized').put(verifyJWT, markShipmentOptimized);
router.route('/metrics').get(verifyJWT, shipmentMetrics);




export default router