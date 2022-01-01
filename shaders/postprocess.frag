#version 450
#extension GL_ARB_separate_shader_objects : enable

layout(push_constant) uniform PushConstant
{
	layout(offset = 68) float postprocess;
	layout(offset = 72) float gamma;
	layout(offset = 76) float scrWidth;
	layout(offset = 80) float scrHeight;
	layout(offset = 84) float offsetX;
	layout(offset = 88) float offsetY;
} pc;

layout(set = 0, binding = 0) uniform sampler2D sTexture;

layout(location = 0) in vec2 texCoord;
layout(location = 0) out vec4 fragmentColor;

void main()
{
	vec2 unnormTexCoord = texCoord * vec2(pc.scrWidth, pc.scrHeight) + vec2(pc.offsetX, pc.offsetY);

	if (pc.postprocess > 0.0)
	{
		float intensity = 1;
		float blurSize = 1.0/pc.scrHeight;
		vec4 sum = vec4(0);
   		vec2 texcoordBloom = vec2(texCoord.x/pc.scrWidth, texCoord.y/pc.scrHeight);
		int j = 0;
   		int i = 0;

		float distanceToCenter = distance(texCoord, vec2(0.5, 0.5));
		float distortionAmount = 1.5 * distanceToCenter * float(2);
    	float dist = float(distance(texCoord, vec2(0,5)) * 0.001);

		sum += texture(sTexture, vec2(texcoordBloom.x - 4.0*blurSize, texcoordBloom.y)) * 0.05;
   		sum += texture(sTexture, vec2(texcoordBloom.x - 3.0*blurSize, texcoordBloom.y)) * 0.09;
		sum += texture(sTexture, vec2(texcoordBloom.x - 2.0*blurSize, texcoordBloom.y)) * 0.12;
		sum += texture(sTexture, vec2(texcoordBloom.x - blurSize, texcoordBloom.y)) * 0.15;
		sum += texture(sTexture, vec2(texcoordBloom.x, texcoordBloom.y)) * 0.16;
		sum += texture(sTexture, vec2(texcoordBloom.x + blurSize, texcoordBloom.y)) * 0.15;
		sum += texture(sTexture, vec2(texcoordBloom.x + 2.0*blurSize, texcoordBloom.y)) * 0.12;
		sum += texture(sTexture, vec2(texcoordBloom.x + 3.0*blurSize, texcoordBloom.y)) * 0.09;
		sum += texture(sTexture, vec2(texcoordBloom.x + 4.0*blurSize, texcoordBloom.y)) * 0.05;

		sum += texture(sTexture, vec2(texcoordBloom.x, texcoordBloom.y - 4.0*blurSize)) * 0.05;
		sum += texture(sTexture, vec2(texcoordBloom.x, texcoordBloom.y - 3.0*blurSize)) * 0.09;
		sum += texture(sTexture, vec2(texcoordBloom.x, texcoordBloom.y - 2.0*blurSize)) * 0.12;
		sum += texture(sTexture, vec2(texcoordBloom.x, texcoordBloom.y - blurSize)) * 0.15;
		sum += texture(sTexture, vec2(texcoordBloom.x, texcoordBloom.y)) * 0.16;
		sum += texture(sTexture, vec2(texcoordBloom.x, texcoordBloom.y + blurSize)) * 0.15;
		sum += texture(sTexture, vec2(texcoordBloom.x, texcoordBloom.y + 2.0*blurSize)) * 0.12;
		sum += texture(sTexture, vec2(texcoordBloom.x, texcoordBloom.y + 3.0*blurSize)) * 0.09;
		sum += texture(sTexture, vec2(texcoordBloom.x, texcoordBloom.y + 4.0*blurSize)) * 0.05;

		//fragmentColor.r = pow(textureLod(sTexture,unnormTexCoord + vec2(distortionAmount * dist, 0.0), pc.blur).r * 1.5, pc.gamma);  
		//fragmentColor.g = pow(textureLod(sTexture,unnormTexCoord, pc.blur).g * 1.5, pc.gamma);
		//fragmentColor.b = pow(textureLod(sTexture,unnormTexCoord - vec2(distortionAmount * dist, 0.0), pc.blur).b * 1.5, pc.gamma);

		fragmentColor.r = pow(textureLod(sTexture,unnormTexCoord + vec2(distortionAmount * dist, 0.0), 1.5).r * 1.5, pc.gamma);  
		fragmentColor.g = pow(textureLod(sTexture,unnormTexCoord, 1.5).g * 1.5, pc.gamma);
		fragmentColor.b = pow(textureLod(sTexture,unnormTexCoord - vec2(distortionAmount * dist, 0.0), 1.5).b * 1.5, pc.gamma);

	}
	else
	{
		fragmentColor = textureLod(sTexture, unnormTexCoord, 0.0);
	}
}
