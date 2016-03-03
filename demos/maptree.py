from pynteractive import *
import random

# Setting up the phylogenetic tree populated with random data

a=PhyloTree()

# Pregenerated newick tree
a.setData('((1:1e-08,2:1e-08)NODE_428:0,(3:1e-08,(4:1e-08,(5:5.783e-05,((6:0.00010819,(7:0.00013731,8:7.585e-05)NODE_422:3.491e-05)NODE_423:9.16e-06,(9:0.00013225,(((10:7.047e-05,(11:3.4e-07,12:1e-08)NODE_414:8.288e-05)NODE_418:1.929e-05,(13:0.00017608,(14:0.0002001,(15:8.088e-05,(16:6.747e-05,(17:9.635e-05,(((((18:3.4e-07,19:1e-08)NODE_401:1e-08,(20:1e-08,(21:1e-08,(22:1e-08,23:1e-08)NODE_398:1e-08)NODE_399:6.3e-07)NODE_400:2e-08)NODE_402:4.2e-06,(24:4.51e-06,25:1e-08)NODE_403:1e-08)NODE_404:5.409e-05,(26:1e-08,(27:1e-08,(28:1e-08,(29:1e-08,30:1e-08)NODE_394:1e-08)NODE_395:1e-08)NODE_396:1.15e-06)NODE_397:6.313e-05)NODE_408:1.414e-05,((31:9.743e-05,(32:2.46e-06,(33:1e-08,(34:2.61e-06,35:1e-08)NODE_389:1e-08)NODE_390:8.9e-07)NODE_391:5.949e-05)NODE_393:5.147e-05,(36:0.00010331,(37:3.82e-06,(38:1e-08,39:1e-08)NODE_384:5.45e-06)NODE_385:0.00013143)NODE_405:1.339e-05)NODE_407:3.467e-05)NODE_409:3.746e-05)NODE_410:3.109e-05)NODE_411:1e-08)NODE_412:2.76e-06)NODE_413:6.748e-05)NODE_417:3.554e-05)NODE_419:6.247e-05,(40:0.00011602,((41:1e-08,42:1e-08)NODE_406:0.00013074,(43:3.969e-05,((((44:3.5e-07,45:1e-08)NODE_380:7.719e-05,((46:3.61e-06,(47:1e-08,(48:1e-08,49:2.6e-07)NODE_372:9e-08)NODE_373:3.39e-06)NODE_374:8.974e-05,(50:1e-08,(51:6.9e-07,(52:1e-08,(53:1e-08,(54:3.1e-07,55:1e-08)NODE_375:1e-08)NODE_376:1e-08)NODE_377:1e-08)NODE_378:1e-08)NODE_379:8.525e-05)NODE_382:6.97e-06)NODE_383:3.952e-05,(56:0.00017984,(((57:2.398e-05,((58:1.842e-05,(59:7e-07,60:1e-08)NODE_353:4.546e-05)NODE_366:2.47e-06,((61:7e-07,62:2.82e-06)NODE_362:1.615e-05,(63:1.556e-05,(64:3.8e-07,65:1e-08)NODE_360:1.833e-05)NODE_365:9.9e-07)NODE_367:1.97e-06)NODE_368:1e-08)NODE_369:2.41e-06,((66:2.298e-05,67:2.119e-05)NODE_349:1.06e-06,((68:2.328e-05,(69:1.585e-05,70:9.76e-06)NODE_348:1.634e-05)NODE_350:3.8e-07,((((71:1e-08,(72:1e-08,(73:3.4e-07,74:1e-08)NODE_319:1e-08)NODE_320:1e-08)NODE_321:1e-08,(75:1e-08,(76:7e-08,77:1e-08)NODE_317:4e-08)NODE_318:2.1e-07)NODE_322:3.302e-05,((78:1.806e-05,79:2.712e-05)NODE_333:2.78e-06,((80:1e-08,(81:3.4e-07,82:8.9e-07)NODE_314:9.4e-07)NODE_315:4.573e-05,((((83:1e-08,(84:1e-08,(85:1e-08,(86:1e-08,(87:1e-08,88:1e-08)NODE_282:5e-07)NODE_284:4.6e-07)NODE_290:7e-08)NODE_292:1e-08)NODE_295:1e-08,((89:1e-08,90:1e-08)NODE_293:1e-08,(91:1e-08,(92:1e-08,(93:1e-08,(94:1e-08,(95:1e-08,(96:1e-08,(97:1e-08,98:3.4e-07)NODE_285:1e-08)NODE_286:1e-08)NODE_287:1e-08)NODE_288:1.5e-07)NODE_289:2e-07)NODE_291:1e-08)NODE_294:1e-08)NODE_296:1e-08)NODE_297:5.436e-05,((99:1e-08,((100:4.1e-07,(101:1e-08,(102:1e-08,(103:1e-08,104:1e-08)NODE_305:1e-08)NODE_306:1e-08)NODE_307:3.4e-07)NODE_308:4.22e-06,105:1e-08)NODE_311:1e-08)NODE_312:4.033e-05,(106:1.904e-05,(107:1.459e-05,(108:1e-08,109:1.07e-06)NODE_313:2.081e-05)NODE_316:6.42e-06)NODE_323:4.3e-07)NODE_324:3.99e-06)NODE_326:2.62e-06,(110:1.922e-05,(111:1.607e-05,112:3.58e-05)NODE_325:1.75e-06)NODE_327:1.4e-06)NODE_328:1.389e-05)NODE_329:5.37e-06)NODE_335:6.07e-06)NODE_338:1.714e-05,(((113:5.977e-05,((114:1e-08,(115:1e-08,(116:1e-08,(117:1e-08,(118:1e-08,119:1e-08)NODE_262:1.1e-07)NODE_263:2.9e-07)NODE_264:2.7e-07)NODE_265:1e-07)NODE_266:1.919e-05,(120:1.628e-05,((121:1e-08,122:1e-08)NODE_260:1e-08,(123:1e-08,(124:6.9e-07,(125:1e-08,126:1e-08)NODE_257:1e-08)NODE_258:1e-08)NODE_259:4.2e-06)NODE_261:3.027e-05)NODE_269:3.6e-07)NODE_270:9.84e-06)NODE_271:9e-07,((127:4.507e-05,(128:3.4e-07,(129:1e-08,130:1e-08)NODE_239:3.16e-06)NODE_240:2.686e-05)NODE_241:5.365e-05,((131:6.938e-05,132:6.135e-05)NODE_235:2.287e-05,(133:5.55e-06,(134:1e-08,(135:1e-08,(136:1e-08,((137:1e-08,138:1e-08)NODE_224:6.9e-07,(139:1e-08,(140:1e-08,(141:1e-08,(142:1e-08,(143:1e-08,(144:1e-08,(145:1e-08,((146:1.73e-06,((147:1e-08,(148:1e-08,(149:1e-08,(150:1e-08,151:1e-08)NODE_216:3.7e-07)NODE_217:1e-08)NODE_218:1e-08)NODE_219:1e-08,152:1e-08)NODE_220:1e-08)NODE_221:1e-08,153:1e-08)NODE_222:1e-08)NODE_223:8.4e-07)NODE_225:8e-08)NODE_226:1e-08)NODE_227:1e-08)NODE_228:1e-08)NODE_229:1e-08)NODE_230:1e-08)NODE_231:1e-08)NODE_232:1e-08)NODE_233:2.15e-06)NODE_234:5.673e-05)NODE_236:1.824e-05)NODE_237:0.00013046)NODE_267:2.892e-05)NODE_272:5.676e-05,(154:4.673e-05,(((155:1e-08,156:1e-08)NODE_238:8.918e-05,(157:1e-08,((158:1e-08,159:1e-08)NODE_242:1e-08,(160:3.6e-07,161:7.5e-07)NODE_243:1e-08)NODE_244:1e-08)NODE_245:5.09e-06)NODE_246:3.509e-05,(162:1e-08,(163:1e-08,(164:1e-08,(165:1e-08,(166:1e-08,(167:1e-08,(168:1e-08,(169:1e-08,(170:1e-08,(171:1e-08,172:1e-08)NODE_247:1e-08)NODE_248:1e-08)NODE_249:1e-08)NODE_250:1e-08)NODE_251:1e-08)NODE_252:1e-08)NODE_253:1e-08)NODE_254:1e-08)NODE_255:1e-08)NODE_256:2.183e-05)NODE_268:3.778e-05)NODE_273:4.564e-05)NODE_274:0.00020023)NODE_347:1.864e-05)NODE_351:1e-08)NODE_352:5.311e-05)NODE_370:1.107e-05,(((((((173:8.549e-05,174:1e-08)NODE_331:3.8e-07,(175:1e-08,176:1e-08)NODE_330:4.8e-07)NODE_332:1.29e-05,(177:6.95e-06,178:1.077e-05)NODE_340:1.03e-06)NODE_342:3.59e-06,((179:1.41e-06,180:1e-08)NODE_334:1.453e-05,(181:1.38e-06,(182:3.4e-07,183:1e-08)NODE_336:1e-08)NODE_337:1.178e-05)NODE_344:1.09e-06)NODE_345:5.5e-07,((184:1e-08,(((185:2.77e-06,(186:1e-08,(187:1e-08,(188:1e-08,(189:1e-08,(190:1e-08,(191:1e-08,(192:1e-08,(193:1e-08,194:1e-08)NODE_275:1e-08)NODE_276:1e-08)NODE_277:1e-08)NODE_278:1e-08)NODE_279:1e-08)NODE_280:5.1e-07)NODE_281:5.9e-07)NODE_283:1.24e-06)NODE_298:2.37e-06,(195:1e-08,(196:2.08e-06,(197:1e-08,(198:1e-08,(199:1e-08,200:1e-08)NODE_299:1e-08)NODE_300:3e-08)NODE_301:3.4e-07)NODE_302:2e-07)NODE_303:1.9e-07)NODE_304:5.67e-06,201:1.03e-06)NODE_309:1e-08)NODE_310:7.839e-05,(202:5.13e-06,(203:7.31e-06,204:9.73e-06)NODE_339:2.19e-06)NODE_341:1.54e-06)NODE_343:3.01e-06)NODE_346:6.146e-05,((205:1e-08,(206:2.14e-06,207:1e-08)NODE_356:1e-08)NODE_357:1.047e-05,((208:1e-08,209:3.6e-07)NODE_354:1.222e-05,(210:1e-08,211:1e-08)NODE_355:7.29e-06)NODE_359:4.31e-06)NODE_361:2.81e-06)NODE_363:1e-08,(212:7.1e-07,213:1.04e-06)NODE_358:1.214e-05)NODE_364:3.071e-05)NODE_371:0.00010089)NODE_381:8.616e-05)NODE_387:1.82e-06,(214:1e-08,215:1e-08)NODE_386:2.924e-05)NODE_388:2.758e-05)NODE_392:0.00020826)NODE_415:3.641e-05)NODE_416:0.00011421)NODE_420:4.316e-05)NODE_421:5.687e-05)NODE_424:5.02e-06)NODE_425:8.121e-05)NODE_426:1e-08)NODE_427:1e-08)NODE_429;')

a.view()

# Adding presence absence track
t1=a.addTrack("first track",'magenta')

#Setting random values into the first track
for i in range(25):
    a.addTrackFeature(t1,str(random.randint(1,215)))

# Adding gradient track
t2=a.addGradientTrack("Second track",'blue',0,100)

#Setting random values inthe second track
for i in range(1,216):
    a.addTrackFeature(t2,str(i),value=random.randint(0,100))


# Adding 2 Bars per tip
b1=a.addBar('first bar','lightblue',1,50)
b2=a.addBar('second bar','mediumpurple',1,50)

# Setting random values on each bar
for i in range(1,216):
    a.addTrackBar(b1,str(i),random.randint(1,51))
    a.addTrackBar(b2,str(i),random.randint(1,51))

m=Map()
m.view()



# randomly generated postcodes
postcodes=['EN4 9HE', 'N2 0ED', 'N3 1SE', 'N2 9HS', 'EC4A 3AF', 'EC1N 2LE', 'WC1V 7YP', 'WC2B 4RP', 'WC2H 9DL', 'EC1A 9NB', 
'EC1V 4JH', 'EC1Y 8JT', 'EC2Y 9NY', 'EC3A 7BX', 'EC3A 5DE', 'EH1 2BU', 'EC2N 2QQ', 'WC2E 9AY', 'SW1V 1JG', 'SW1W 9DS', 
'SW1A 2JF', 'SW1H 9HF', 'SW1H 0ET', 'W1W 8QS', 'W1F 0JE', 'EC1R 3AL', 'EC1P 1FN', 'WC1X 9HW', 'WC1H 9LT', 'NW1 1BJ', 'W1C 2AA', 
'W1U 3QE', 'W1G 7HJ', 'W1U 7JE', 'W10 5XB', 'NW10 5JU', 'W9 1NL', 'NW8 0SP', 'NW3 3JH', 'E1W 2WE', 'EH14 3HF', 'SE24 0AU', 
'SE23 2HB', 'SE6 3AT', 'SE22 0PT', 'SE23 3XN', 'SE26 4QB', 'SE20 8XL', 'SM6 9AU', 'CR44 1AZ', 'CR0 2RL', 'SE27 0SE', 'SW16 5LN', 'CR7 7JE', 
'CR4 1HR', 'SM4 6BU', 'SW18 1AJ', 'SW20 0NR', 'SW6 4AG', 'SW6 7TY', 'SW15 5BX', 'SW13 0HS', 'W11 4SL', 'W12 7JA', 'W5 1AP', 
'W5 3AS', 'W5 2NQ', 'W4 4WF', 'TW8 9RP', 'TW10 5BJ', 'TW5 0BB', 'TW3 2BA', 'KT2 6HG', 'KT7 0WA', 'KT5 8QJ', 'KT6 4LS', 'KT7 0BH', 
'TW12 1AT', 'TW12 3YB', 'KT8 2TF', 'UB3 1BY', 'TW14 0AZ', 'TW6 1PW', 'TW6 3LP', 'TW17 8EP', 'TW17 8JN', 'KT16 9HX', 'GU19 5BA', 
'GU14 6UZ', 'RG29 1AY', 'RG25 2NT', 'SO20 6AG', 'RG28 7RR', 'RG28 7AH', 'RG20 9HZ', 'RG26 4XB', 'RG26 3RH', 'RG40 3SJ', 'RG27 0LW', 
'RG7 4UB', 'RG18 4DZ', 'RG7 6RP', 'RG7 3AS', 'SL95 1DB', 'GU25 4AZ', 'SL3 9QE', 'SL4 2NH', 'GU25 4NZ', 'GU20 6LS', 'RG12 7WF', 
'RG40 4UF', 'RG41 2ZY', 'RG41 5NP', 'RG5 4UT', 'RG5 3AW', 'RG6 1PD', 'RG30 4AX', 'RG30 1AN', 'RG4 5JU', 'HP15 6YB', 'HP10 8DF', 
'SL8 5BH', 'HP12 4QW', 'HP13 5BP', 'HP12 4HG', 'HP16 0AY', 'HP23 4DA', 'HP22 6NY', 'OX39 4BB', 'OX39 4PZ', 'GL50 2TU', 'GL54 1EU', 
'OX15 4EL', 'HP18 9TZ', 'OX44 9JL', 'OX33 1PS', 'RG8 9HJ', 'GL6 0NR', 'RG14 2JW', 'GL6 7RL', 'SN16 0PN', 'SN11 9BD', 'SN11 9RD', 
'SN8 2RN', 'SN5 6HL', 'SN38 0QA', 'SN4 0PJ', 'SN2 1BF', 'SN25 1SL', 'SN2 2JZ', 'RG20 7DZ', 'OX11 0NF', 'OX14 2HA', 'WS9 9BL', 
'OX18 1EY', 'OX28 4BS', 'OX13 5JU', 'OX2 8BE', 'OX1 4XG', 'OX28 3YJ', 'OX3 7SF', 'MK4 3FZ', 'MK3 7DW', 'MK5 6NB', 'MK4 4EX', 
'MK3 7HZ', 'MK12 5RS', 'MK13 9AT', 'MK13 8AW', 'MK9 4AP', 'MK10 9PB', 'MK1 1RE', 'B29 4LY', 'B29 5RX', 'B62 0EB', 'B64 7JR', 
'DY6 8NT', 'DY1 4HG', 'B18 7AL', 'B21 0RN', 'B99 1BL', 'B13 0HN', 'B5 5LY', 'B18 6BA', 'B21 9NX', 'B5 4AN', 'B6 5RH', 'B4 6NP', 
'B3 2BH', 'B2 2SP', 'B12 0PP', 'B12 8JG', 'B10 0DG', 'B9 5UN', 'B44 0PU', 'B90 1JR', 'B35 6PJ', 'B36 9AP', 'B26 2LE', 'B27 7JS', 
'B27 7ES', 'B27 6DA', 'B93 0ER', 'DY9 0ND', 'WV5 8BW', 'WV14 9SF', 'WV3 8EZ', 'WV3 9HN', 'WV13 1RT', 'WV13 1AU', 'WS2 0AW', 
'WV12 5TN', 'WS1 1ER', 'WS14 0AW', 'WV9 5BU']

# Painting each node in the map
for n,pc in enumerate(postcodes,1):
	m.addNode(n,place=pc,color="steelblue")

# Callback function called everytime a selection is made on the map
def mapselection(nodes):
	a.clearCladeMarks()
	a.markClade(nodes,'green')
m.selectionHandler(mapselection)

# Callback function called everytime a selection is made on the tree
def treeselection(nodes):
	for i in m.getNodes():
		m.updateNode(i,color='steelblue')
	for i in nodes:
		m.updateNode(i,color='crimson')
a.selectionHandler(treeselection)

#Opening a python console to stop the program here.
# If the python script finished the webbrowser is closed automatically
import code
code.interact(local=locals())