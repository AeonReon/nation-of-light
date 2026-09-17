import json,base64,subprocess,sys
STYLE=', full body portrait, vertical composition, classical oil painting in the manner of the nineteenth century academic painters, rich warm golden light, fine detail, heroic and dignified, beautiful, unsigned painting, no text'
NEG='text, words, letters, watermark, logo, signature, ugly, deformed, extra fingers, extra limbs, blurry, cartoon, anime, modern clothing, wristwatch, watch, bracelet, grey hair, old man, wrinkles, beard, gore, blood, nudity'
JOBS={
 's2b':"the same young man with the same youthful clean-shaven face and the same short dark curly hair, twenty-five years old, now a strong fit Roman legionary with broad shoulders, thick muscular arms and strong legs, wearing polished segmented steel armour over a red tunic, a red cloak, a sword at his belt, holding his crested helmet under one arm and a large red and gold shield resting at his side, standing tall and confident inside a Roman fort with wooden palisade and tents in the morning sun",
 's3b':"the same young man with the same youthful clean-shaven face and the same short dark curly hair, thirty years old, in his prime, powerful athletic build with very broad shoulders, thick muscular arms and strong muscular legs, the Emperor of Rome, wearing a golden laurel wreath, a gleaming gold and bronze muscle cuirass, a long imperial purple cloak with gold embroidery, bare forearms and bare wrists, tall laced leather boots, standing majestic and calm at the top of white marble steps before a great temple with tall columns, golden sunset sky, banners",
}
for k,p in JOBS.items():
    b={'prompt':p+STYLE,'negative_prompt':NEG,'steps':8,'width':704,'height':1024,'cfg_scale':2,'seed':11,'batch_size':1,'hires_fix':False,'upscaler':None,'init_images':[base64.b64encode(open('s1.png','rb').read()).decode()],'strength':1,'image_guidance':2.5}
    json.dump(b,open(k+'.json','w'))
    subprocess.run(['curl','-s','-m','1500','-X','POST','-H','Content-Type: application/json','--data-binary','@'+k+'.json','http://127.0.0.1:7859/sdapi/v1/img2img','-o',k+'.out.json'],check=True)
    d=json.load(open(k+'.out.json')); open(k+'.png','wb').write(base64.b64decode(d['images'][0])); print('ok',k,flush=True)
