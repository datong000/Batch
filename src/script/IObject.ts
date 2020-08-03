/**
 * 场景物件接口
 * @author zhouyulong
 * 2018年8月21日 11:27:29
 */
export interface IObject
{
    /**唯一id */
    id: number;

    /**x坐标 */
    x: number;

    /**y坐标 */
    y: number;

    /**z坐标 */
    z: number;

    /**x旋转坐标 */
    rx: number;

    /**y旋转坐标 */
    ry: number;

    /**z旋转坐标 */
    rz: number;

    /**x缩放 */
    sx: number;

    /**y缩放 */
    sy: number;

    /**z缩放 */
    sz: number;


    /**
     * 更新位置
     * @param x     x坐标
     * @param y     y坐标
     * @param z     z坐标
     */
    updatePostion( x: number, y: number, z: number ): void;

    /**
     * 更新旋转信息
     * @param rx    rx
     * @param ry    ry
     * @param rz    rz
     */
    updateRotation( rx: number, ry: number, rz: number ): void;

    /**
     * 更新缩放值
     */
    updateScale( sx: number, sy: number, sz: number ): void;
}
