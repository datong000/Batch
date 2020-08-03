import { SubQueue } from "./SubQueue";

/**
 * 自定义序列
 * @author zhouyulong
 * 2019年3月8日 18:20:12
 */
export class Queue
{
    public type: eQueueType;
    public registerCla: any;
    public isUpdate: boolean = false;

    private _i: number;
    private _j: number;
    private _index: number;
    private _offset: number;
    private _tmp: SubQueue;
    private _newIndexBuffer: Uint16Array;
    private _newVertexBuffer: Float32Array;
    private _tmpVec3: Laya.Vector3;
    private _vertexDecl: Laya.VertexDeclaration;

    private _mesh: Laya.Mesh;

    public get mesh(): Laya.Mesh
    {
        return this._mesh;
    }

    private _queue: Array<SubQueue>;

    public get queue(): Array<SubQueue>
    {
        return this._queue;
    }

    public set queue( value: Array<SubQueue> )
    {
        this._queue = value;
    }

    private _meshCnt: number;

    public get meshCnt(): number
    {
        return this._meshCnt;
    }

    public set meshCnt( value: number )
    {
        this._meshCnt = value;
        if ( this._queue == null )
        {
            this._queue = new Array<SubQueue>( value );
            for ( let i: number = 0; i < value; i++ )
            {
                let struct: SubQueue = new this.registerCla();
                this._queue[ i ] = struct;
            }
        }
    }

    public init( mesh?: Laya.Mesh, meshCnt?: number ): void
    {
        if ( this._queue == null )
        {
            this._queue = new Array<SubQueue>( meshCnt );
        }
        this.createSubQueue( mesh );
    }

    private createSubQueue( mesh: Laya.Mesh ): void
    {
        let i: number;
        let j: number;
        let vData: Float32Array;
        let totalIndLen: number = 0;
        let totalVerLen: number = 0;

        this._offset = 0;
        if ( mesh )
        {
            this._vertexDecl = mesh._vertexBuffers[ 0 ].vertexDeclaration;
            for ( i = 0; i < this._queue.length; i++ )
            {
                if ( this._queue[ i ] == null )
                {
                    let subMesh: SubQueue = new this.registerCla();
                    subMesh.mesh = mesh;
                    this._queue[ i ] = subMesh;
                }
                totalIndLen += mesh._indexBuffer.getData().length;
                totalVerLen += mesh._vertexBuffers[ 0 ].getData().length;
            }
        }
        else
        {
            for ( i = 0; i < this._queue.length; i++ )
            {
                totalIndLen += this._queue[ i ].indexs.length;
                totalVerLen += this._queue[ i ].vertex.length;
            }
            this._vertexDecl = this._queue[ 0 ].mesh._vertexBuffers[ 0 ].vertexDeclaration;
        }
        this._newIndexBuffer = new Uint16Array( totalIndLen );
        this._newVertexBuffer = new Float32Array( totalVerLen );

        this.declaration();

        this._mesh = Laya.PrimitiveMesh._createMesh( this._vertexDecl, this._newVertexBuffer, this._newIndexBuffer );
        this.update();
    }

    private declaration(): void
    {
        let length: number;
        let j: number;
        this._offset = 0;
        length = this._vertexDecl.vertexElements.length;
        for ( j = 0; j < length; j++ )
        {
            switch ( this._vertexDecl.vertexElements[ j ].elementFormat )
            {
                case "vector3":
                    this._offset += 3;
                    break;
                case "vector2":
                    this._offset += 2;
                    break;
            }
        }
    }

    /**
     * 重构mesh(非特殊情况慎用)
     */
    public resetMesh(): void
    {
        let totalIndLen: number = 0;
        let totalVerLen: number = 0;
        let vertexDeclaration: Laya.VertexDeclaration;
        this._newIndexBuffer = null;
        this._newVertexBuffer = null;
        for ( let i: number = 0; i < this._queue.length; i++ )
        {
            if ( this._queue[ i ] )
            {
                vertexDeclaration = this._queue[ i ].mesh._vertexBuffers[ 0 ].vertexDeclaration;
                totalIndLen += this._queue[ i ].indexs.length;
                totalVerLen += this._queue[ i ].vertex.length;
            }
        }
        this._newIndexBuffer = new Uint16Array( totalIndLen );
        this._newVertexBuffer = new Float32Array( totalVerLen );
        this._mesh.destroy();
        this._mesh = Laya.PrimitiveMesh._createMesh( vertexDeclaration, this._newVertexBuffer, this._newIndexBuffer );
        this.update();
    }

    public update(): void
    {
        this.updateIBuff();
        this.updateVBuff();
    }

    public updateIBuff(): void
    {
        let i: number;
        let j: number;
        let vLast: number = 0;
        let iLast: number = 0;
        let iData: Uint16Array;
        for ( i = 0; i < this._queue.length; i++ )
        {
            if ( this._queue[ i ] )
            {
                iData = this._queue[ i ].indexs;
                for ( j = 0; j < iData.length; j++ )
                {
                    this._newIndexBuffer[ j + iLast ] = iData[ j ] + vLast;
                }
                vLast += this._queue[ i ].vertexCount;
                iLast += this._queue[ i ].indexCount;
            }
        }

        this.mesh._indexBuffer.setData( this._newIndexBuffer );
    }

    public updateVBuff(): void
    {
        this._index = 0;
        for ( this._i = 0; this._i < this._queue.length; this._i++ )
        {
            this._tmp = this._queue[ this._i ];

            if ( !this._tmp || !this._tmp.vertex || !this._tmp.isUpdate ) { this._index += this._tmp.vertex.length; continue; }

            for ( this._j = 0; this._j < this._tmp.vertex.length; this._j += this._offset )
            {
                if ( !this._tmp.visible )
                {
                    this._newVertexBuffer[ this._index ] = NaN;
                    this._newVertexBuffer[ this._index + 1 ] = NaN;
                    this._newVertexBuffer[ this._index + 2 ] = NaN;
                }
                else
                {
                    this._newVertexBuffer[ this._index ] = this._tmp.vertex[ this._j ] + this._tmp.position.x;
                    this._newVertexBuffer[ this._index + 1 ] = this._tmp.vertex[ this._j + 1 ] + this._tmp.position.y;
                    this._newVertexBuffer[ this._index + 2 ] = this._tmp.vertex[ this._j + 2 ] + this._tmp.position.z;
                }
                this._newVertexBuffer[ this._index + 3 ] = this._tmp.vertex[ this._j + 3 ];
                this._newVertexBuffer[ this._index + 4 ] = this._tmp.vertex[ this._j + 4 ];
                this._newVertexBuffer[ this._index + 5 ] = this._tmp.vertex[ this._j + 5 ];
                this._newVertexBuffer[ this._index + 6 ] = this._tmp.vertex[ this._j + 6 ];
                this._newVertexBuffer[ this._index + 7 ] = this._tmp.vertex[ this._j + 7 ];
                this._newVertexBuffer[ this._index + 8 ] = this._tmp.vertex[ this._j + 8 ];
                this._newVertexBuffer[ this._index + 9 ] = this._tmp.vertex[ this._j + 9 ];
                this._index += this._offset;
            }
        }
        this.mesh._vertexBuffers[ 0 ].setData( this._newVertexBuffer );
    }
}

export enum eQueueType
{
    STATIC,
    DYNAMIC,
}
