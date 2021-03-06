import { forwardTo } from 'prisma-binding';
import { upload } from 'now-storage';
import * as streamToArray from 'stream-to-array';
import * as sharp from 'sharp';
import { Context } from '../utils';

interface PlaceOrderInput {
  items: { cardItem: string; subitems: string[]; restaurant: string }[];
  tip: number;
}

export const Mutation = {
  createRestaurant: forwardTo('db'),
  updateRestaurant: forwardTo('db'),
  deleteRestaurant: forwardTo('db'),
  createOrganization: forwardTo('db'),
  updateOrganization: forwardTo('db'),
  deleteOrganization: forwardTo('db'),
  deleteEmployment: forwardTo('db'),
  createCard: forwardTo('db'),
  updateCard: forwardTo('db'),
  deleteCard: forwardTo('db'),
  imageUpload: async (obj, { file }, ctx) => {
    const { filename, stream } = await file;
    const buffers = await streamToArray(stream);
    const originalContent = Buffer.concat(buffers);

    const content = await sharp(originalContent)
      .resize(225, 225)
      .background('black')
      .jpeg({
        quality: 70,
        chromaSubsampling: '4:4:4',
      })
      .toBuffer();

    // TODO: needs better error handling
    // TODO: add a max file size
    const { url } = await upload(
      process.env.BACKEND_NOW_TOKEN,
      {
        name: filename,
        content,
      },
      {
        deploymentName: 'foed-media',
        teamId: 'volst',
      }
    );
    return { url: `https://${url}` };
  },
  async placeOrder(
    parent: any,
    { data }: { data: PlaceOrderInput },
    ctx: Context,
    info: any
  ) {
    // TODO: this can probably be improved for performance; first fetch all required data and then loop through data.items.
    const lastOrders = await ctx.db.query.orders({
      orderBy: 'number_DESC',
      first: 1,
    });

    let lastOrderNumber = 1;
    if (lastOrders.length > 0 && lastOrders[0].number) {
      lastOrderNumber = lastOrders[0].number! + 1;
    }

    const order = {
      number: lastOrderNumber,
      items: { create: [] as any[] },
      tip: data.tip,
    };

    for (const itemInput of data.items) {
      const cardItem = await ctx.db.query.cardItem({
        where: { id: itemInput.cardItem },
      });
      if (!cardItem) {
        throw new Error(`Cannot find card item ${itemInput.cardItem}`);
      }
      const cardSubItems = await ctx.db.query.cardSubitems({
        where: { id_in: itemInput.subitems },
      });

      let subtotal = cardItem.price;

      const subItemConnects: any[] = [];
      for (const cardSubitem of cardSubItems) {
        subtotal += cardSubitem.price;

        subItemConnects.push({ id: cardSubitem.id });
      }

      order.items.create.push({
        subtotal,
        cardItem: { connect: { id: cardItem.id } },
        subitems: { connect: subItemConnects },
        restaurant: { connect: { id: itemInput.restaurant } },
      });
    }

    return await ctx.db.mutation.createOrder({ data: order });
  },
};
