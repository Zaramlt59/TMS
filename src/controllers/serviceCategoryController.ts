import { Request, Response } from 'express';
import { ServiceCategoryService } from '../services/serviceCategoryService';

export class ServiceCategoryController {
  private service: ServiceCategoryService;

  constructor() {
    this.service = new ServiceCategoryService();
  }

  async getAll(req: Request, res: Response) {
    const result = await this.service.getAll();
    res.status(result.success ? 200 : 400).json(result);
  }

  async getActive(req: Request, res: Response) {
    const result = await this.service.getActive();
    res.status(result.success ? 200 : 400).json(result);
  }

  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const result = await this.service.getById(id);
    res.status(result.success ? 200 : 404).json(result);
  }

  async create(req: Request, res: Response) {
    const result = await this.service.create(req.body);
    res.status(result.success ? 201 : 400).json(result);
  }

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const result = await this.service.update(id, req.body);
    res.status(result.success ? 200 : 400).json(result);
  }

  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const result = await this.service.delete(id);
    res.status(result.success ? 200 : 404).json(result);
  }

  async hardDelete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const result = await this.service.hardDelete(id);
    res.status(result.success ? 200 : 400).json(result);
  }
}


