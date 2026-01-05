import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ICredentialDataDecryptedObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import * as webpush from 'web-push';
import type { RequestOptions } from 'web-push';

export class WebPush implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Push Web Notification',
		name: 'webPush',
		icon: 'file:webpush.svg',
		group: ['output'],
		version: 1,
		description: 'Send push notifications using the Web Push API',
		defaults: {
			name: 'Push Web Notification',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'vapidApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Endpoint',
				name: 'endpoint',
				type: 'string',
				default: '',
				required: true,
				description: 'The push subscription endpoint URL',
				placeholder: 'https://fcm.googleapis.com/fcm/send/...',
			},
			{
				displayName: 'Auth',
				name: 'auth',
				type: 'string',
				default: '',
				required: true,
				description: 'The authentication secret from the push subscription',
				placeholder: 'Base64url-encoded auth secret',
			},
			{
				displayName: 'P256dh',
				name: 'p256dh',
				type: 'string',
				default: '',
				required: true,
				description: 'The P256dh key from the push subscription',
				placeholder: 'Base64url-encoded P256dh public key',
			},
			{
				displayName: 'Payload',
				name: 'payload',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'The notification payload text to send',
				placeholder: 'Your notification message',
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'TTL',
						name: 'ttl',
						type: 'number',
						default: 2419200,
						description: 'Time to live in seconds (default: 4 weeks)',
					},
					{
						displayName: 'Urgency',
						name: 'urgency',
						type: 'options',
						options: [
							{
								name: 'Very Low',
								value: 'very-low',
							},
							{
								name: 'Low',
								value: 'low',
							},
							{
								name: 'Normal',
								value: 'normal',
							},
							{
								name: 'High',
								value: 'high',
							},
						],
						default: 'normal',
						description: 'The urgency of the push notification',
					},
					{
						displayName: 'Topic',
						name: 'topic',
						type: 'string',
						default: '',
						description: 'A topic for the push notification (max 32 characters)',
					},
					{
						displayName: 'Timeout',
						name: 'timeout',
						type: 'number',
						default: 30000,
						description: 'Request timeout in milliseconds',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const credentials = await this.getCredentials('vapidApi', itemIndex) as ICredentialDataDecryptedObject;

				const endpoint = this.getNodeParameter('endpoint', itemIndex, '') as string;
				const auth = this.getNodeParameter('auth', itemIndex, '') as string;
				const p256dh = this.getNodeParameter('p256dh', itemIndex, '') as string;
				const payload = this.getNodeParameter('payload', itemIndex, '') as string;
				const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex, {}) as {
					ttl?: number;
					urgency?: string;
					topic?: string;
					timeout?: number;
				};

				const pushSubscription = {
					endpoint,
					keys: {
						auth,
						p256dh,
					},
				};

				const vapidDetails = {
					subject: credentials.subject as string,
					publicKey: credentials.publicKey as string,
					privateKey: credentials.privateKey as string,
				};

				const options: RequestOptions = {
					vapidDetails,
				};

				if (credentials.gcmApiKey) {
					options.gcmAPIKey = credentials.gcmApiKey as string;
				}

				if (additionalOptions.ttl !== undefined) {
					options.TTL = additionalOptions.ttl;
				}

				if (additionalOptions.urgency) {
					options.urgency = additionalOptions.urgency as 'very-low' | 'low' | 'normal' | 'high';
				}

				if (additionalOptions.topic) {
					options.topic = additionalOptions.topic;
				}

				if (additionalOptions.timeout) {
					options.timeout = additionalOptions.timeout;
				}

				const response = await webpush.sendNotification(
					pushSubscription,
					payload,
					options,
				);

				returnData.push({
					json: {
						success: true,
						statusCode: response.statusCode,
						headers: response.headers,
						body: response.body,
					},
					pairedItem: itemIndex,
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							success: false,
							error: error.message,
						},
						error,
						pairedItem: itemIndex,
					});
				} else {
					if (error.context) {
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [returnData];
	}
}
