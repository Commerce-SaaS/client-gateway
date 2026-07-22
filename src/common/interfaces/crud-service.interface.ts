export interface CrudService<CreateDto, UpdateDto> {
  create(dto: CreateDto, organizationId: string): any;
  findAll(pagination: any, organizationId: string): any;
  findOne(id: string, organizationId: string): any;
  update(id: string, dto: UpdateDto, organizationId: string): any;
  remove(id: string, organizationId: string): any;
}
