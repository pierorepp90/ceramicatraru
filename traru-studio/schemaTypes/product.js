import {defineType, defineField} from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Pieza',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required().error('Poné el nombre de la pieza.'),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          {title: 'Cuenco', value: 'Cuenco'},
          {title: 'Tinaja', value: 'Tinaja'},
          {title: 'Plato', value: 'Plato'},
          {title: 'Jarrón', value: 'Jarrón'},
          {title: 'Taza', value: 'Taza'},
          {title: 'Set', value: 'Set'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required().error('Elegí una categoría.'),
    }),
    defineField({
      name: 'images',
      title: 'Fotos',
      description: 'Subí una o varias fotos reales de la pieza. La primera es la principal.',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              description: 'Breve descripción de la foto (accesibilidad/SEO). Opcional.',
              type: 'string',
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).error('Subí al menos una foto.'),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      description: 'Texto que aparece en el detalle de la pieza.',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'material',
      title: 'Material',
      description: 'Ej: "Gres rojo · esmalte ceniza".',
      type: 'string',
    }),
    defineField({
      name: 'edition',
      title: 'Edición',
      description: 'Ej: "Pieza única", "1 de 6", "Serie de 12".',
      type: 'string',
    }),
    defineField({
      name: 'price',
      title: 'Precio (ARS)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).error('Poné un precio en pesos.'),
    }),
    defineField({
      name: 'onSale',
      title: 'En oferta',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'salePrice',
      title: 'Precio de oferta (ARS)',
      description: 'Se muestra junto al precio anterior tachado. Solo si la pieza está en oferta.',
      type: 'number',
      hidden: ({document}) => !document?.onSale,
      validation: (Rule) =>
        Rule.custom((salePrice, context) => {
          if (!context.document?.onSale) return true
          if (salePrice == null) return 'Poné el precio de oferta.'
          if (salePrice < 0) return 'El precio de oferta no puede ser negativo.'
          return true
        }),
    }),
    defineField({
      name: 'stockState',
      title: 'Disponibilidad',
      type: 'string',
      options: {
        list: [
          {title: 'Disponible', value: 'Disponible'},
          {title: 'Últimas unidades', value: 'Últimas unidades'},
          {title: 'Sin stock', value: 'Sin stock'},
        ],
        layout: 'radio',
      },
      initialValue: 'Disponible',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tone',
      title: 'Tono de acento',
      description: 'Color cálido que usa la tarjeta como fondo/acento mientras carga la foto.',
      type: 'string',
      options: {
        list: [
          {title: 'Terracota', value: 'terracotta'},
          {title: 'Arena', value: 'arena'},
          {title: 'Ceniza', value: 'ceniza'},
          {title: 'Ámbar', value: 'ambar'},
          {title: 'Ocre', value: 'ocre'},
          {title: 'Hueso', value: 'hueso'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'terracotta',
    }),
    defineField({
      name: 'order',
      title: 'Orden',
      description: 'Número para ordenar las piezas en la galería (menor primero). Opcional.',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Orden manual',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'images.0',
      price: 'price',
      onSale: 'onSale',
      salePrice: 'salePrice',
      stock: 'stockState',
    },
    prepare({title, subtitle, media, price, onSale, salePrice, stock}) {
      const shown = onSale && salePrice != null ? salePrice : price
      const money =
        shown != null ? '$ ' + new Intl.NumberFormat('es-AR').format(shown) : 'sin precio'
      const flag = stock && stock !== 'Disponible' ? ` · ${stock}` : ''
      return {
        title: title || 'Sin nombre',
        subtitle: `${subtitle || 'sin categoría'} — ${money}${flag}`,
        media,
      }
    },
  },
})
