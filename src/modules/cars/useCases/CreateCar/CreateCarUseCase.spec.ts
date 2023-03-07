import { AppError } from "@shared/errors/AppError";
import { CarsRepositoryInMemory } from "../../repositories/in-memory/CarsRepositoryInMemory";
import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Car", () => {
  beforeAll(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it("Should be able to create a new car", async () => {
    const car = {
      name: "Car Test",
      description: "Car description Test",
      daily_rate: 1,
      license_plate: "123123",
      fine_amount: 10,
      brand: "Car Brand Test",
      category_id: null,
    };

    await createCarUseCase.execute(car);

    const carCreated = await carsRepositoryInMemory.findByName(car.name);

    expect(carCreated).toHaveProperty("id");
  });

  it("Should not be able to create a car if the license plate already exists", async () => {
    expect(async () => {
      const car = {
        name: "Car Test",
        description: "Car description Test",
        daily_rate: 1,
        license_plate: "123123",
        fine_amount: 10,
        brand: "Car Brand Test",
        category_id: null,
      };

      await createCarUseCase.execute(car);

      await createCarUseCase.execute(car);
    }).rejects.toBeInstanceOf(AppError);
  });
  it("Car should be created with available equal true", async () => {
    const car = {
      name: "Car Test",
      description: "Car description Test",
      daily_rate: 1,
      license_plate: "1231234",
      fine_amount: 10,
      brand: "Car Brand Test",
      category_id: null,
    };

    await createCarUseCase.execute(car);

    const carCreated = await carsRepositoryInMemory.findByName(car.name);

    expect(carCreated.available).toBe(true);
  });
});
