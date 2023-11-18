import Paket from "@/models/paketModels"
import { NextResponse } from "next/server"
import startDb from "@/db/dbConfig"

export const dynamic = "force-dynamic"

// CREATE PAKET BY SUBJECTID
export async function POST(
  request: Request,
  { params }: { params: { subjectId: string } }
) {
  const subjectId = params.subjectId

  await startDb()

  try {
    const reqBody = await request.json()
    const { year, type } = reqBody

    const paket = await Paket.findOne({ year, type, _subjectId: subjectId })

    if (paket) {
      throw new Error("Paket dengan tahun dan tipe yang sama sudah ada")
    } else {
      const paket = await Paket.create({ year, type, _subjectId: subjectId })

      return NextResponse.json({
        status: 201,
        message: `Berhasil membuat paket ${paket.year} - ${paket.type}`,
        paket: paket,
      })
    }
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}

// GET ALL PAKET BY SUBJECTID
export async function GET(
  request: Request,
  { params }: { params: { subjectId: string } }
) {
  const subjectId = params.subjectId

  await startDb()

  try {
    const pakets = await Paket.find({ _subjectId: subjectId }).sort({
      year: -1,
      type: -1,
    })

    return NextResponse.json({
      status: 200,
      message: "Berhasil mendapatkan data",
      pakets: pakets,
    })
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: error.message })
  }
}
