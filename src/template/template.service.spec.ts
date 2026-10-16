import { Test, TestingModule } from '@nestjs/testing';
import { TemplateService } from './template.service.js';
import { DataSource } from 'typeorm';
import * as teamQueries from '../database/querys/team/team.js';

describe('TemplateService', () => {
  let service: TemplateService;
  let mockDataSource: any;
  let mockQueryBuilder: any;

  const user = {
    userId: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    image: '',
    exp: 12345,
    iat: 12345,
  };

  beforeEach(async () => {
    mockQueryBuilder = {
      where: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      leftJoinAndSelect: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      into: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      execute: vi.fn(),
      getOne: vi.fn(),
      getMany: vi.fn(),
      getCount: vi.fn(),
    };

    mockDataSource = {
      getRepository: vi.fn().mockReturnValue({
        createQueryBuilder: vi.fn().mockReturnValue(mockQueryBuilder),
        softDelete: vi.fn(),
      }),
      createQueryBuilder: vi.fn().mockReturnValue(mockQueryBuilder),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplateService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<TemplateService>(TemplateService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findTemplatesByTeamId', () => {
    it('should throw if user is not in team', async () => {
      vi.spyOn(teamQueries, 'findUserInTeam').mockResolvedValue('Team not found' as any);

      await expect(service.findTemplatesByTeamId('team-1', user)).rejects.toBe('Team not found');
    });

    it('should return templates if user is in team', async () => {
      vi.spyOn(teamQueries, 'findUserInTeam').mockResolvedValue([{ usercount: '1' }] as any);
      const mockTemplates = [{ id: 'tmpl-1', templateName: 'Device 1' }];
      mockQueryBuilder.getMany.mockResolvedValue(mockTemplates);

      const res = await service.findTemplatesByTeamId('team-1', user);
      expect(res).toEqual(mockTemplates);
    });
  });

  describe('findOneByTemplateId', () => {
    it('should throw if template is not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);

      await expect(service.findOneByTemplateId('tmpl-1', user)).rejects.toBe('Template not found.');
    });

    it('should throw if user has no access to team', async () => {
      mockQueryBuilder.getOne.mockResolvedValue({ id: 'tmpl-1', team: { id: 'team-1' } });
      vi.spyOn(teamQueries, 'findUserInTeam').mockResolvedValue([] as any);

      await expect(service.findOneByTemplateId('tmpl-1', user)).rejects.toBe('You do not have access to this template.');
    });

    it('should return template if found and user has access', async () => {
      const mockTemplate = { id: 'tmpl-1', templateName: 'T1', team: { id: 'team-1' } };
      mockQueryBuilder.getOne.mockResolvedValue(mockTemplate);
      vi.spyOn(teamQueries, 'findUserInTeam').mockResolvedValue([{ usercount: '1' }] as any);

      const res = await service.findOneByTemplateId('tmpl-1', user);
      expect(res).toEqual(mockTemplate);
    });
  });

  describe('updateByTemplateId', () => {
    it('should throw if template not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);

      await expect(service.updateByTemplateId('tmpl-1', { templateName: 'New' }, user)).rejects.toBe('Template not found.');
    });

    it('should update template successfully', async () => {
      const existing = { id: 'tmpl-1', templateName: 'Old', team: { id: 'team-1' } };
      const updated = { id: 'tmpl-1', templateName: 'New', team: { id: 'team-1' } };
      mockQueryBuilder.getOne.mockResolvedValueOnce(existing).mockResolvedValueOnce(updated);
      vi.spyOn(teamQueries, 'findUserInTeam').mockResolvedValue([{ usercount: '1' }] as any);
      mockQueryBuilder.getCount.mockResolvedValue(0);
      mockQueryBuilder.execute.mockResolvedValue({ affected: 1 });

      const res = await service.updateByTemplateId('tmpl-1', { templateName: 'New' }, user);
      expect(res).toEqual(updated);
    });
  });

  describe('deleteByTemplateId', () => {
    it('should delete template successfully', async () => {
      const existing = { id: 'tmpl-1', templateName: 'Old', team: { id: 'team-1' } };
      mockQueryBuilder.getOne.mockResolvedValue(existing);
      vi.spyOn(teamQueries, 'findUserInTeam').mockResolvedValue([{ usercount: '1' }] as any);
      mockDataSource.getRepository().softDelete.mockResolvedValue({ affected: 1 });

      const res = await service.deleteByTemplateId('tmpl-1', user);
      expect(res).toEqual({ id: 'tmpl-1', deleted: true });
    });
  });
});

