export class Box extends Laya.MeshSprite3D
{
    private _t: number = 0;
    private _r: number;

    constructor()
    {
        super( Laya.PrimitiveMesh.createBox( 0.15, 0.15, 0.15 ) );
        this.transform.translate( new Laya.Vector3( -1.5 + Math.random() * 3.5, Math.random() * 5, 2 + -Math.random() * 6 ), false );
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
            this.transform.position.z = Math.sin( this._t );
        }
        else if ( this._r >= 0.3 && this._r < 0.5 )
        {
            this.transform.position.z = Math.cos( this._t );
        }
        else if ( this._r >= 0.5 && this._r < 0.7 )
        {
            this.transform.position.y = Math.sin( this._t );
        }
        else if ( this._r >= 0.7 && this._r < 0.9 )
        {
            this.transform.position.y = Math.sin( this._t );
        }
        else if ( this._r >= 0.9 )
        {
            this.transform.position.x = Math.cos( this._t );
        }
        this.transform.position = this.transform.position;
    }

}