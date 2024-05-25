import fs from 'fs';
import path from 'path';
import {
    Discount,
    NotificationChannelConfiguration,
} from '@michaelbui99-discount-alerter/models';
import { NotificationChannel } from './channel';

export class Notifier {
    private configMap: Map<string, NotificationChannelConfiguration>;
    private idMap: Map<string, boolean>;
    private channels: NotificationChannel[];
    private channelMap: Map<string, NotificationChannel>;
    private channelDirs: string[];

    constructor(configurations: NotificationChannelConfiguration[]) {
        this.configMap = new Map<string, NotificationChannelConfiguration>();
        this.idMap = new Map<string, boolean>();
        this.channelMap = new Map<string, NotificationChannel>();

        configurations.forEach((config) => {
            if (this.configMap.has(config.channel)) {
                throw new Error(
                    `Notification Channel with id ${config.channel} has been configured multiple times.`,
                );
            }

            this.configMap.set(config.channel, config);
        });
    }

    public async notify(
        channel: NotificationChannel | string,
        discount: Discount,
    ): Promise<void> {
        let targetChannel: NotificationChannel;
        if (typeof channel === 'string') {
            if (!this.channelMap.has(channel)) {
                throw new Error(
                    `No channel with id ${channel} has been loaded`,
                );
            }

            targetChannel = this.channelMap.get(channel)!;
        }

        const config = this.configMap.get(targetChannel!.getId()) ?? {
            channel: targetChannel!.getId(),
            config: new Map<string, any>(),
        };
        targetChannel!.init(config);
        await targetChannel!.send(discount);
    }

    public async loadChannels(): Promise<NotificationChannel[]> {
        await Promise.all(
            this.channelDirs.map((dirPath) => this.loadDirectory(dirPath)),
        );

        this.channels.forEach((channel) => {
            this.channelMap.set(channel.getId(), channel);
        });

        return this.channels;
    }

    public registerChannelDir(channelDir: string): Notifier {
        this.channelDirs.push(path.resolve(channelDir));
        return this;
    }

    public registerChannel(channel: NotificationChannel): Notifier {
        if (this.idMap.has(channel.getId())) {
            throw new Error(
                `Channel with id ${channel.getId()} has already been loaded. (version: ${channel.getVersion()})`,
            );
        }

        if (!(channel instanceof NotificationChannel)) {
            throw new Error('Invalid channel');
        }

        this.idMap.set(channel.getId(), true);
        this.channels.push(channel);

        return this;
    }

    private async loadDirectory(channelDir: string) {
        const resolvedDirPath = path.resolve(channelDir);
        const files = fs.readdirSync(resolvedDirPath);
        const jsFiles = files.filter((file) => file.endsWith('.js'));
        const importedModules = await Promise.all(
            jsFiles.map(
                async (file) => await import(path.join(resolvedDirPath, file)),
            ),
        );

        const loadedChannels = importedModules
            .filter((module) => module.default)
            .map((module) => module.default)
            .filter(
                (channelCandidate) =>
                    channelCandidate instanceof NotificationChannel,
            );

        loadedChannels.forEach((channel) => this.registerChannel(channel));
    }
}
