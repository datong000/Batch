import { SubQueue } from "./SubQueue";

export class SubBox extends SubQueue
{
    private _t: number = 0;
    private _r: number;

    constructor()
    {
        super();
        this.position = new Laya.Vector3( -1.7 + Math.random() * 3.5, Math.random() * 6, 2 + -Math.random() * 8 );
        this._r = Math.random();
        Laya.timer.once( Math.random() * 500, this, () =>
        {
            Laya.timer.frameLoop( 1, this, this.update );
        } )
    }

    public update(): void
    {
        this._t += 0.01;
        if ( this._r > 0.1 && this._r < 0.3 )
        {
            this.z = Math.sin( this._t );
        }
        else if ( this._r >= 0.3 && this._r < 0.5 )
        {
            this.z = Math.cos( this._t );
        }
        else if ( this._r >= 0.5 && this._r < 0.7 )
        {
            this.y = Math.sin( this._t );
        }
        else if ( this._r >= 0.7 && this._r < 0.9 )
        {
            this.y = Math.sin( this._t );
        }
        else if ( this._r >= 0.9 )
        {
            this.x = Math.cos( this._t );
        }
    }
}
