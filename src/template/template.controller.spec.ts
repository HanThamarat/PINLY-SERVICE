import { Test, TestingModule } from '@nestjs/testing';
import { TemplateController } from './template.controller.js';
import { TemplateService } from './template.service.js';

describe('TemplateController', () => {
  let controller: TemplateController;

  const mockTemplateService = {
    createTemplate: vi.fn(),
    findTemplatesByTeamId: vi.fn(),
    findOneByTemplateId: vi.fn(),
    updateByTemplateId: vi.fn(),
    deleteByTemplateId: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateController],
      providers: [
        {
          provide: TemplateService,
          useValue: mockTemplateService,
        },
      ],
    }).compile();

    controller = module.get<TemplateController>(TemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find templates by teamId', async () => {
    const mockTemplates = [{ id: 'tmpl-1', templateName: 'Temp 1' }];
    mockTemplateService.findTemplatesByTeamId.mockResolvedValue(mockTemplates);

    const req = { user: { userId: 'user-1' } };
    const res = await controller.findTemplatesByTeamId(req, 'team-1');

    expect(res).toEqual({
      status: 200,
      message: 'Getting templates by team successfully.',
      body: mockTemplates,
    });
    expect(mockTemplateService.findTemplatesByTeamId).toHaveBeenCalledWith('team-1', req.user);
  });

  it('should find one template by templateId', async () => {
    const mockTemplate = { id: 'tmpl-1', templateName: 'Temp 1' };
    mockTemplateService.findOneByTemplateId.mockResolvedValue(mockTemplate);

    const req = { user: { userId: 'user-1' } };
    const res = await controller.findOneByTemplateId(req, 'tmpl-1');

    expect(res).toEqual({
      status: 200,
      message: 'Getting template successfully.',
      body: mockTemplate,
    });
    expect(mockTemplateService.findOneByTemplateId).toHaveBeenCalledWith('tmpl-1', req.user);
  });

  it('should update template by templateId', async () => {
    const mockUpdated = { id: 'tmpl-1', templateName: 'Updated Name' };
    mockTemplateService.updateByTemplateId.mockResolvedValue(mockUpdated);

    const req = { user: { userId: 'user-1' } };
    const dto = { templateName: 'Updated Name' };
    const res = await controller.updateByTemplateId(req, 'tmpl-1', dto);

    expect(res).toEqual({
      status: 200,
      message: 'Updating template successfully.',
      body: mockUpdated,
    });
    expect(mockTemplateService.updateByTemplateId).toHaveBeenCalledWith('tmpl-1', dto, req.user);
  });

  it('should delete template by templateId', async () => {
    const mockDeleted = { id: 'tmpl-1', deleted: true };
    mockTemplateService.deleteByTemplateId.mockResolvedValue(mockDeleted);

    const req = { user: { userId: 'user-1' } };
    const res = await controller.deleteByTemplateId(req, 'tmpl-1');

    expect(res).toEqual({
      status: 200,
      message: 'Deleting template successfully.',
      body: mockDeleted,
    });
    expect(mockTemplateService.deleteByTemplateId).toHaveBeenCalledWith('tmpl-1', req.user);
  });
});

