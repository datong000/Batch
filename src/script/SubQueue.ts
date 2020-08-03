import { IObject } from "./IObject";

/**
 * 自定义游戏场景物件基类
 * @author zhouyulong
 * 2018年8月21日 11:26:01
 */
export class SubQueue implements IObject
{
    /**唯一id */
    public id: number;
    /**坐标 */
    public position: Laya.Vector3;
    /**矩阵 */
    public matrix: Laya.Matrix4x4;
    public visible: boolean = true;
    public isUpdate: boolean = true;

    private _rotaMat: Laya.Matrix4x4;
    private _scaMat: Laya.Matrix4x4;
    private _isTrastrom: boolean = false;

    private _indexCount: number;

    public get indexCount(): number
    {
        return this._indexCount;
    }

    private _vertexCount: number;

    public get vertexCount(): number
    {
        return this._vertexCount;
    }

    private _indexs: Uint16Array;

    public get indexs(): Uint16Array
    {
        return this._indexs;
    }

    private _vertex: Float32Array;

    public get vertex(): Float32Array
    {
        return this._vertex;
    }

    private _mesh: Laya.Mesh;

    public get mesh(): Laya.Mesh
    {
        return this._mesh;
    }

    public set mesh( value: Laya.Mesh )
    {
        if ( value == null )
        {
            this._vertex = null;
            this._indexs = null;
            return;
        }
        this._mesh = value;

        this._vertex = value._vertexBuffers[ 0 ].getData();
        this._indexs = value._indexBuffer.getData();
        this._indexCount = value._indexBuffer.indexCount;
        this._vertexCount = value.vertexCount;
    }

    constructor()
    {
        this.position = new Laya.Vector3();
        this.matrix = new Laya.Matrix4x4();
        this._rotaMat = new Laya.Matrix4x4();
        this._scaMat = new Laya.Matrix4x4();
    }

    public reset(): void
    {
        this.position.setValue( 0, 0, 0 );
        this.matrix.identity();
        this._rotaMat.identity();
        this._scaMat.identity();
    }

    public get isTrastrom(): boolean
    {
        return this._isTrastrom;
    }

    public get x(): number
    {
        return this.position.x;
    }

    public set x( value: number )
    {
        this.position.x = value;
    }

    public get y(): number
    {
        return this.position.y;
    }

    public set y( value: number )
    {
        this.position.y = value;
    }

    public get z(): number
    {
        return this.position.z;
    }

    public set z( value: number )
    {
        this.position.z = value;
    }

    private _rx: number;

    /**
     * x旋转坐标
     */
    public set rx( value: number )
    {
        if ( value == this._rx || value == null ) return;
        this._rx = value;
        // GameMathUtils.rotationX( value, this.matrix );
        this._isTrastrom = true;
    }

    /**
     * x旋转坐标
     */
    public get rx(): number
    {
        return this._rx;
    }

    private _ry: number;

    /**y旋转坐标 */
    public set ry( value: number )
    {
        if ( value == this._ry || value == null ) return;
        this._ry = value;
        // GameMathUtils.rotationY( value, this.matrix );
        this._isTrastrom = true;
    }

    /**y旋转坐标 */
    public get ry(): number
    {
        return this._ry;
    }

    private _rz: number;

    /**z旋转坐标 */
    public set rz( value: number )
    {
        if ( value == this._ry || value == null ) return;
        this._rz = value;
        // GameMathUtils.rotationZ( value, this.matrix );
        this._isTrastrom = true;
    }

    /**z旋转坐标 */
    public get rz(): number
    {
        return this._rz;
    }

    private _sx: number;

    public get sx(): number
    {
        return this._sx;
    }

    public set sx( value: number )
    {
        this._sx = value;
    }

    private _sy: number;

    public get sy(): number
    {
        return this._sy;
    }

    public set sy( value: number )
    {
        this._sy = value;
    }

    private _sz: number;

    public get sz(): number
    {
        return this._sz;
    }

    public set sz( value: number )
    {
        this._sz = value;
    }

    /**
     * 更新位置
     * @param x     x坐标
     * @param y     y坐标
     * @param z     z坐标
     */
    public updatePostion( x: number, y: number, z: number ): void
    {
        this.position.setValue( x, y, z );
    }

    /**
     * 更新旋转信息
     * @param rx    rx
     * @param ry    ry
     * @param rz    rz
     */
    public updateRotation( rx: number, ry: number, rz: number ): void
    {
        if ( Math.abs( rx ) != 0 || Math.abs( ry ) != 0 || Math.abs( rz ) != 0 )
        {
            // GameMathUtils.rotation( MathUnits.angleTurnRadian( rx ), MathUnits.angleTurnRadian( ry ), MathUnits.angleTurnRadian( rz ), this._rotaMat ); 
            Laya.Matrix4x4.multiply( this._rotaMat, this._scaMat, this.matrix );
            this._isTrastrom = true;
        }
    }

    /**
     * 更新缩放
     */
    public updateScale( sx: number, sy: number, sz: number ): void
    {
        if ( sx != 1 || sy != 1 || sz != 1 )
        {
            let out = this._scaMat.elements;
            out[ 0 ] = sx;
            out[ 5 ] = sy;
            out[ 10 ] = sz;
            out[ 1 ] = out[ 4 ] = out[ 8 ] = out[ 12 ] = out[ 9 ] = out[ 13 ] = out[ 2 ] = out[ 6 ] = out[ 14 ] = out[ 3 ] = out[ 7 ] = out[ 11 ] = 0;
            out[ 15 ] = 1;
            Laya.Matrix4x4.multiply( this._rotaMat, this._scaMat, this.matrix );
            this._isTrastrom = true;
        }
    }
}
