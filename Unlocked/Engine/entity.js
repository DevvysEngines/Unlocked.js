import { element } from "./element.js";
import { game } from "./engine.js";

export class entity extends element {
    constructor(Name,x,y,renderer,hitbox,properties,...allNodes){
        super(Name,x,y,renderer,hitbox,properties,...allNodes);
    }
    setup(){
        let hI;
        if (!this.get(`properties`,`maxHealth`))this.set(`properties`,`maxHealth`,100);
        if (!this.get(`properties`,`health`))this.set(`properties`,`health`,100);
        hI = this.getHealthInfo;
        this.set(`properties`,`healthPercentage`,hI.health/hI.maxHealth);
        this.set(`properties`,`lastDamaged`,null);
        this.set(`properties`,`lastDamagedAmount`,0);
        this.set(`properties`,`entitiesThatDamaged`,new Map());
        this.set(`properties`,`entitiesThatDidDamage`,0);
        this.set(`properties`,`lastDamageDealtTo`,null);
        this.set(`properties`,`lastDamageDealtAmount`,0);
        this.set(`properties`,`entitiesKilled`, new Map());
        this.set(`properties`,`entitiesKilledAmount`,0);
        this.set(`properties`,`entitiesThatThisDamaged`,new Map());
        this.set(`properties`,`entitiesDamaged`,0);
    }
    get health(){
        return this.get(`properties`,`health`);
    }
    get healthPercentage(){
        return this.get(`properties`,`healthPercentage`)
    }
    get getHealthInfo(){
        return {
            health: this.health
            ,maxHealth: this.get(`properties`,`maxHealth`)
            ,healthPercentage: this.healthPercentage
            ,lastDamaged: this.get(`properties`,`lastDamaged`)
            ,lastDamagedAmount: this.get(`properties`,`lastDamagedAmount`)
            ,entitiesThatDamaged: this.get(`properties`,`entitiesThatDamaged`)
            ,entitiesThatDidDamage: this.get(`properties`,`entitiesThatDidDamage`)
        }
    }
    get getDamageInfo(){
            return {
                lastDamageDealtTo: this.get(`properties`,`lastDamageDealtTo`)
                ,lastDamageDealtAmount: this.get(`properties`,`lastDamageDealtAmount`)
                ,entitiesDamaged: this.get(`properties`,`entitiesDamaged`)
                ,entitiesThatThisDamaged: this.get(`properties`,`entitiesThatThisDamaged`)
                ,entitiesKilledAmount: this.get(`properties`,`entitiesKilledAmount`)
                ,entitiesKilled: this.get(`properties`,`entitiesKilled`)
            }
    }
    Damage(damage,entity){
        if (!entity)return;else if(!entity.isElement)return;
        const oldhealth = this.get(`properties`,`health`);
        const eid = entity.id;
        const id = this.id;
        this.set(`properties`,`health`,oldhealth-damage);
        this.set(`properties`,`lastDamaged`,eid);
        this.set(`properties`,`lastDamagedAmount`,damage);
        let hI = this.getHealthInfo;
        this.set(`properties`,`healthPercentage`,hI.health/hI.maxHealth);

        if (!hI.entitiesThatDamaged.has(eid)){
            let newMap = hI.entitiesThatDamaged;
            newMap.set(eid,{
                id: eid
                ,amount: 1
                ,totalDamage: damage
                ,lastDamage: damage
            })
            this.set(`properties`,`entitiesThatDidDamage`,hI.entitiesThatDidDamage+1);
            this.set(`properties`,`entitiesThatDamaged`,newMap);
        } else {
            let newMap = hI.entitiesThatDamaged;
            let oldMap = hI.entitiesThatDamaged.get(entity.id);
            newMap.set(eid,{
                id: eid
                ,amount: oldMap.amount+1
                ,totalDamage: ((oldMap.totalDamage)+damage)
                ,lastDamage: damage
            })
            this.set(`properties`,`entitiesThatDamaged`,newMap);
        }

        entity.set(`properties`,`lastDamageDealtTo`,id);
        entity.set(`properties`,`lastDamageDealtAmount`,damage);
        let dI = entity.getDamageInfo;
        if (!dI.entitiesThatThisDamaged.has(id)){
            let newentititesDamaged = dI.entitiesDamaged+1;
            let newMap = dI.entitiesThatThisDamaged;
            newMap.set(id,{
                id: id
                ,amount: 1
                ,totalDamage: damage
                ,lastDamage: damage
            })
            entity.set(`properties`,`entitiesDamaged`,newentititesDamaged);
            entity.set(`properties`,`entitiesThatThisDamaged`,newMap);
        } else {
            let newMap = dI.entitiesThatThisDamaged;
            let oldMap = dI.entitiesThatThisDamaged.get(id);
            newMap.set(id,{
                id: id
                ,amount: oldMap.amount+1
                ,totalDamage: ((oldMap.totalDamage)+damage)
                ,lastDamage: damage
            })
            entity.set(`properties`,`entitiesThatThisDamaged`,newMap);
        }

        if (damage>=oldhealth){
            let newMap = dI.entitiesKilled;
            newMap.set(id,true);
            entity.set(`properties`,`entitiesKilled`,newMap);
            entity.set(`properties`,`entitiesKilledAmount`,dI.entitiesKilledAmount+1);
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
        let eTTD = this.get(`properties`,`entitiesThatThisDamaged`);
        let eTD = this.get(`properties`,`entitiesThatDamaged`);
        for (let [ki,vi] of eTTD){
            let entity = game.allElements.get(vi.id);
            let newMap = entity.get(`properties`,`entitiesThatDamaged`);
            newMap.delete(id);
            entity.set(`properties`,`entitiesThatDamaged`,newMap);
        }
        for (let [kv, vv] of eTD){
            let entity = game.allElements.get(vv.id);
            let newMap = entity.get(`properties`,`entitiesThatThisDamaged`);
            newMap.delete(id);
            entity.set(`properties`,`entitiesThatThisDamaged`,newMap);
        }
    }
    customupdate(deltatime){

    }
}