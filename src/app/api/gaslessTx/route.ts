import { NextRequest, NextResponse } from "next/server";
import { GelatoRelay } from "@gelatonetwork/relay-sdk";
import checkIfAddressExistInDb from "services/checkIfAddressExistInDb";

export async function POST(req: NextRequest, { params }) {
  try {
    await checkIfAddressExistInDb(NextResponse);
    const body = await req.json();

    const { signature, struct } = body;

    const relay = new GelatoRelay();
    const relayResponse = await relay.sponsoredCallERC2771WithSignature(
      struct,
      signature,
      process.env.GELATO_API_KEY as string,
    );

    return NextResponse.json(
      { error: null, taskId: relayResponse.taskId },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as any)?.message },
      { status: 400 },
    );
  }
}
