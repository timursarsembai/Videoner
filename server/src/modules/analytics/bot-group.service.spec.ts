import { BadRequestException } from '@nestjs/common';
import { BotGroupService, parseBotGroupEvent } from './bot-group.service';

describe('parseBotGroupEvent', () => {
  it('accepts a valid event and drops junk', () => {
    expect(
      parseBotGroupEvent({ chatId: -100123, event: 'added', title: '  Чат  ', username: 'bad name!', type: 'channel', members: -1, addedById: 42 }),
    ).toEqual({ chatId: -100123, event: 'added', title: 'Чат', username: undefined, type: undefined, members: undefined, addedById: 42, toChatId: undefined });
  });

  it('rejects private chats, unknown events and migration without target', () => {
    expect(() => parseBotGroupEvent({ chatId: 5, event: 'added' })).toThrow(BadRequestException);
    expect(() => parseBotGroupEvent({ chatId: -5, event: 'hack' })).toThrow(BadRequestException);
    expect(() => parseBotGroupEvent({ chatId: -5, event: 'migrated' })).toThrow(BadRequestException);
  });
});

describe('BotGroupService.record', () => {
  const setup = () => {
    const prisma = { botGroup: { upsert: jest.fn().mockResolvedValue({}), findFirst: jest.fn().mockResolvedValue(null) } } as any;
    return { svc: new BotGroupService(prisma), upsert: prisma.botGroup.upsert };
  };

  it('counts downloads without touching the public name', async () => {
    const { svc, upsert } = setup();
    await svc.record({ chatId: -1, event: 'download' });
    const arg = upsert.mock.calls[0][0];
    expect(arg.create.downloads).toBe(1);
    expect(arg.update.downloads).toEqual({ increment: 1 });
    expect('username' in arg.update).toBe(false);
  });

  it('marks removal, and a later link brings the group back', async () => {
    const { svc, upsert } = setup();
    await svc.record({ chatId: -1, event: 'removed' });
    expect(upsert.mock.calls[0][0].update.removedAt).toBeInstanceOf(Date);
    await svc.record({ chatId: -1, event: 'seen', title: 'T' });
    expect(upsert.mock.calls[1][0].update).toMatchObject({ removedAt: null, title: 'T', username: null });
  });

  it('remembers who added the bot', async () => {
    const { svc, upsert } = setup();
    await svc.record({ chatId: -1, event: 'added', addedById: 7, members: 30 });
    expect(upsert.mock.calls[0][0].create).toMatchObject({ addedById: BigInt(7), members: 30, removedAt: null });
  });
});

describe('BotGroupService: опоздавшее событие старой группы после переезда', () => {
  it('is ignored', async () => {
    const upsert = jest.fn();
    const prisma = { botGroup: { upsert, findFirst: jest.fn().mockResolvedValue({ chatId: BigInt(-1) }) } } as any;
    await new BotGroupService(prisma).record({ chatId: -1, event: 'removed' });
    expect(upsert).not.toHaveBeenCalled();
  });
});
