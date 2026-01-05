import type { ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';

export class VapidApi implements ICredentialType {
	name = 'vapidApi';

	displayName = 'VAPID API';

	documentationUrl =
		'https://github.com/Miscoriadev/N8N-Web-Push-Node?tab=readme-ov-file#credentials';

	icon = 'file:vapid.svg' as const;

	test: ICredentialTestRequest = {
		request: {
			method: 'GET',
			url: '={{ $credentials.subject }}',
		},
	};

	properties: INodeProperties[] = [
		{
			displayName: 'Subject',
			name: 'subject',
			type: 'string',
			required: true,
			default: '',
			placeholder: 'mailto:example@yourdomain.org',
			description: 'A contact URI for the application server (e.g., mailto: or https: URL)',
		},
		{
			displayName: 'Public Key',
			name: 'publicKey',
			type: 'string',
			required: true,
			default: '',
			description: 'VAPID public key (base64url-encoded)',
		},
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'VAPID private key (base64url-encoded)',
		},
		{
			displayName: 'GCM API Key',
			name: 'gcmApiKey',
			type: 'string',
			typeOptions: { password: true },
			required: false,
			default: '',
			description:
				'Optional Google Cloud Messaging API key for backward compatibility with older Chrome versions',
		},
	];
}
