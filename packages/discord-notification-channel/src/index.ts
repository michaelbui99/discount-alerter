import {
    Discount,
    NotificationChannelConfiguration,
} from '@michaelbui99-discount-alerter/models';
import { NotificationChannel } from '@michaelbui99-discount-alerter/notification';
import { RateLimiter } from './ratelimiter';

function price(val: number, currency: string): string {
    return `${val} ${currency}`;
}

const ONE_SECOND = 1000;
export class DiscordNotificationChannel extends NotificationChannel {
    private webhook: string = '';
    private rateLimiter: RateLimiter;

    constructor() {
        super(
            '@michaelbui99-discount-alerter/discord-notification-channel',
            'Discord Notification Channel',
            '0.1.0',
        );

        this.rateLimiter = new RateLimiter(50, ONE_SECOND);
    }

    public async send(discount: Discount): Promise<void> {
        const message = {
            content: 'New discount matched your condition!',
            embeds: [
                {
                    title: discount.product.name,
                    description: `Original Price: ${price(
                        discount.offer.originalPrice,
                        discount.offer.currency,
                    )} \nNew Price: ${price(
                        discount.offer.newPrice,
                        discount.offer.currency,
                    )}\nDiscount: ${discount.offer.percentDiscount}%\nStock: ${
                        discount.offer.stock
                    } ${discount.offer.stockUnit}`,
                    color: null,
                    author: {
                        name: discount.store.name,
                    },
                },
            ],
            username: 'Discount Alerter',
            attachments: [],
        };

        if (!this.rateLimiter.acquire()) {
            const timeout = new Promise<void>((resolve) => {
                setTimeout(() => resolve(), ONE_SECOND);
            });
            await timeout;
        }

        const res = await fetch(this.webhook, {
            method: 'POST',
            body: JSON.stringify(message),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error(
                `Failed to send Discount to Discord: ${await res.text()}`,
            );
        }
    }

    public init(config: NotificationChannelConfiguration): void {
        this.webhook = config.config['WEBHOOK'];
    }
}

const discordNotificationChannel = new DiscordNotificationChannel();
export default discordNotificationChannel;
