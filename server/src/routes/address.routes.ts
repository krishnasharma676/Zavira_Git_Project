import { Router } from "express";
import { 
  addAddress, 
  getMyAddresses, 
  setDefaultAddress, 
  deleteAddress 
} from "../controllers/address.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { addressSchema, addressIdSchema } from "../validations/address.validation";

const router = Router();

router.use(authenticate);

router.post("/", validate(addressSchema), addAddress);
router.get("/", getMyAddresses);
router.patch("/:id/default", validate(addressIdSchema), setDefaultAddress);
router.delete("/:id", validate(addressIdSchema), deleteAddress);

export default router;
