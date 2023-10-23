import { Inventory } from '@/entities/inventory.entity';
import { DateTime } from 'luxon';
import { DataSource } from 'typeorm';

export const evaluaProducts = async (datasource: DataSource) => {
  const manager = datasource.manager;
  const products = await manager.find(Inventory);

  products.forEach(async (product) => {
    const { daysBeforeRemove, expiresIn } = product;
    let removeDate = DateTime.fromJSDate(new Date(expiresIn));
    removeDate = removeDate.minus({ days: daysBeforeRemove });
    const now = DateTime.fromISO(new Date().toISOString());
    const leftDaysToRemove = removeDate.diff(now, 'days').days;
    let updatedData = product;
    if (leftDaysToRemove <= daysBeforeRemove) {
      if (leftDaysToRemove < 0) {
        updatedData.state = 'Caducado';
      } else {
        updatedData.state = 'A punto de caducar';
      }
    } else {
      updatedData.state = 'En buen estado';
    }
    updatedData = manager.merge(Inventory, product, updatedData);

    await manager.save(Inventory, updatedData);
  });
};
