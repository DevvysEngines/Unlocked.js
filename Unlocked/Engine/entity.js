import { element } from "./element/element.js";
import { game } from "./engine.js";

export class entity extends element {
    constructor(properties,renderer,hitbox,...allNodes){
        super(properties,renderer,hitbox,...allNodes);
    }
    setup(){
        let hI;
        if(!this.get(`vitals`))this.set(`vitals`,{});
        if (!this.get(`vitals/maxHealth`))this.set(`vitals/maxHealth`,100);
        if (!this.get(`vitals/health`))this.set(`vitals/health`,100);
        hI = this.getHealthInfo;
        this.batchSet(
            [`vitals/healthPercentage`,hI.health/hI.maxHealth]
            ,[`vitals/lastDamaged`,null]
            ,[`vitals/entitiesThatDamaged`,new Map()]
            ,[`vitals/lastDamageDealtTo`,null]
            ,[`vitals/lastDamageDealtAmount`,0]
            ,[`vitals/entitiesKilled`,0]
            ,[`vitals/entitiesThatThisDamaged`,new Map()]
        );
    }
    get health(){
        return this.get(`vitals/health`);
    }
    get healthPercentage(){
        return this.get(`vitals/healthPercentage`)
    }
    get getHealthInfo(){
        return {
            health: this.health
            ,maxHealth: this.get(`vitals/maxHealth`)
            ,healthPercentage: this.healthPercentage
            ,lastDamaged: this.get(`vitals/lastDamaged`)
            ,entitiesThatDamaged: this.get(`vitals/entitiesThatDamaged`)
        }
    }
    get getDamageInfo(){
            return {
                lastDamageDealtTo: this.get(`vitals/lastDamageDealtTo`)
                ,lastDamageDealtAmount: this.get(`vitals/lastDamageDealtAmount`)
                ,entitiesThatThisDamaged: this.get(`vitals/entitiesThatThisDamaged`)
                ,entitiesKilled: this.get(`vitals/entitiesKilled`)
            }
    }
    Damage(damage,entity){
        if (!entity)return;else if(!entity.isElement)return;
        const oldhealth = this.get(`vitals/health`);
        const eid = entity.id;
        const id = this.id;
        this.set(`vitals/health`,oldhealth-damage);
        this.set(`vitals/lastDamaged`,eid);
        let hI = this.getHealthInfo;
        this.set(`vitals/healthPercentage`,hI.health/hI.maxHealth);

        if (!hI.entitiesThatDamaged.has(eid)){
            let newMap = hI.entitiesThatDamaged;
            newMap.set(eid,{
                id: eid
                ,times: 1
                ,totalDamage: damage
                ,lastDamage: damage
            })
        } else {
            let newMap = hI.entitiesThatDamaged;
            let oldMap = newMap.get(entity.id);
            newMap.set(eid,{
                id: eid
                ,times: oldMap.times+1
                ,totalDamage: ((oldMap.totalDamage)+damage)
                ,lastDamage: damage
            })
            this.set(`vitals/entitiesThatDamaged`,newMap);
        }

        entity.set(`vitals/lastDamageDealtTo`,id);
        entity.set(`vitals/lastDamageDealtAmount`,damage);
        let dI = entity.getDamageInfo;
        if (!dI.entitiesThatThisDamaged.has(id)){
            let newMap = dI.entitiesThatThisDamaged;
            newMap.set(id,{
                id: id
                ,times: 1
                ,totalDamage: damage
                ,lastDamage: damage
            })
        } else {
            let newMap = dI.entitiesThatThisDamaged;
            let oldMap = dI.entitiesThatThisDamaged.get(id);
            newMap.set(id,{
                id: id
                ,times: oldMap.times+1
                ,totalDamage: ((oldMap.totalDamage)+damage)
                ,lastDamage: damage
            })
        }

        if (damage>=oldhealth){
            let amm = dI.entitiesKilled+1;
            entity.set(`vitals/entitiesKilled`,amm);
            entity.set(`vitals/entitiesKilledAmount`,dI.entitiesKilledAmount+1);
            this.death();
        };
    }
    dealDamage(damage,entity){
        entity.Damage(damage,this);
    }
    death(){
        const hI = this.getHealthInfo;
        console.log(`${this.Name} has died to ${game.allElements.get(hI.lastDamaged).Name}!`)
        this.destroy()
    };
    customdestroy(){
        const id = this.id
        let eTTD = this.get(`vitals/entitiesThatThisDamaged`);
        let eTD = this.get(`vitals/entitiesThatDamaged`);
        for (let [ki,vi] of eTTD){
            let entity = game.allElements.get(vi.id);
            let newMap = entity.get(`vitals/entitiesThatDamaged`);
            newMap.delete(id);
            entity.set(`vitals/entitiesThatDamaged`,newMap);
        }
        for (let [kv, vv] of eTD){
            let entity = game.allElements.get(vv.id);
            let newMap = entity.get(`vitals/entitiesThatThisDamaged`);
            newMap.delete(id);
            entity.set(`vitals/entitiesThatThisDamaged`,newMap);
        }
    }
    customupdate(deltatime){

    }
}