import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ruler } from "lucide-react";

interface SizeGuideProps {
  category: string;
}

const sizeGuides = {
  hoodies: [
    { size: "XS", chest: "88-92", length: "66", shoulder: "42" },
    { size: "S", chest: "92-96", length: "68", shoulder: "44" },
    { size: "M", chest: "96-100", length: "70", shoulder: "46" },
    { size: "L", chest: "100-104", length: "72", shoulder: "48" },
    { size: "XL", chest: "104-110", length: "74", shoulder: "50" },
  ],
  remeras: [
    { size: "XS", chest: "86-90", length: "68", shoulder: "40" },
    { size: "S", chest: "90-94", length: "70", shoulder: "42" },
    { size: "M", chest: "94-98", length: "72", shoulder: "44" },
    { size: "L", chest: "98-102", length: "74", shoulder: "46" },
    { size: "XL", chest: "102-108", length: "76", shoulder: "48" },
  ],
  buzos: [
    { size: "XS", chest: "88-92", length: "64", shoulder: "42" },
    { size: "S", chest: "92-96", length: "66", shoulder: "44" },
    { size: "M", chest: "96-100", length: "68", shoulder: "46" },
    { size: "L", chest: "100-104", length: "70", shoulder: "48" },
    { size: "XL", chest: "104-110", length: "72", shoulder: "50" },
  ],
  gorras: [
    { size: "U", circumference: "56-60" },
  ],
};

const SizeGuide = ({ category }: SizeGuideProps) => {
  const guide = sizeGuides[category as keyof typeof sizeGuides] || sizeGuides.remeras;
  const isHat = category === "gorras";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Ruler className="mr-2 h-4 w-4" />
          Guía de talles
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Guía de Talles</DialogTitle>
          <DialogDescription>
            Todas las medidas están en centímetros (cm)
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Talle</TableHead>
                {isHat ? (
                  <TableHead>Circunferencia</TableHead>
                ) : (
                  <>
                    <TableHead>Pecho</TableHead>
                    <TableHead>Largo</TableHead>
                    <TableHead>Hombro</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {guide.map((row) => (
                <TableRow key={row.size}>
                  <TableCell className="font-medium">{row.size}</TableCell>
                  {isHat ? (
                    <TableCell>{row.circumference}</TableCell>
                  ) : (
                    <>
                      <TableCell>{row.chest}</TableCell>
                      <TableCell>{row.length}</TableCell>
                      <TableCell>{row.shoulder}</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 rounded-lg bg-muted p-4 text-sm">
          <p className="font-medium">Cómo medir:</p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>• Pecho: Medí el ancho a la altura del pecho, de costura a costura</li>
            <li>• Largo: Desde el cuello hasta el bajo de la prenda</li>
            <li>• Hombro: De costura de hombro a costura de hombro</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizeGuide;
